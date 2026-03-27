import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function ColaboradorComissoes({ user }: { user: any }) {
  const [comissoes, setComissoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [resumo, setResumo] = useState({ totalMes: 0, totalPendente: 0, totalPago: 0 })

  useEffect(() => {
    async function load() {
      try {
        const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const { data } = await supabase
          .from("comissoes")
          .select("*")
          .eq("colaborador_id", user.id)
          .gte("created_at", inicioMes)
          .order("created_at", { ascending: false })

        const lista = data || []
        setComissoes(lista)
        setResumo({
          totalMes: lista.reduce((acc: number, c: any) => acc + (c.valor || 0), 0),
          totalPendente: lista.filter((c: any) => c.status === "pendente").reduce((acc: number, c: any) => acc + (c.valor || 0), 0),
          totalPago: lista.filter((c: any) => c.status === "pago").reduce((acc: number, c: any) => acc + (c.valor || 0), 0),
        })
      } catch {
        // tabela pode nao existir
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Comissoes</h2>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Acompanhe suas comissoes do mes</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { icon: "💰", label: "Total no Mes", valor: fmt(resumo.totalMes), cor: "8,145,178" },
          { icon: "⏳", label: "Pendente", valor: fmt(resumo.totalPendente), cor: "234,179,8" },
          { icon: "✅", label: "Pago", valor: fmt(resumo.totalPago), cor: "34,197,94" },
        ].map((kpi, i) => (
          <div key={i} style={{ ...cardStyle, background: `linear-gradient(135deg, rgba(${kpi.cor},0.12), rgba(0,0,0,0))` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px" }}>{kpi.label}</div>
                <div style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>{kpi.valor}</div>
              </div>
              <span style={{ fontSize: "20px", opacity: 0.6 }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      ) : comissoes.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎯</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Nenhuma comissao neste mes</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>Suas comissoes aparecerão aqui quando forem geradas</div>
        </div>
      ) : (
        <div style={{ ...cardStyle }}>
          <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Detalhamento</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {comissoes.map((c: any, i: number) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", background: "rgba(255,255,255,0.02)",
                borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div>
                  <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{c.descricao || `OS #${c.os_id || "—"}`}</div>
                  <div style={{ color: "#52525b", fontSize: "11px", marginTop: "2px" }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: c.status === "pago" ? "#22c55e" : "#eab308", fontSize: "14px", fontWeight: "700" }}>
                    {fmt(c.valor || 0)}
                  </div>
                  <div style={{
                    color: c.status === "pago" ? "#22c55e" : "#eab308",
                    fontSize: "10px", fontWeight: "600", textTransform: "uppercase",
                  }}>
                    {c.status || "pendente"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
