import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
  aprovado: { label: "Aprovado", cor: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  pendente: { label: "Pendente", cor: "#eab308", bg: "rgba(234,179,8,0.1)" },
  rejeitado: { label: "Rejeitado", cor: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  gozando: { label: "Em Ferias", cor: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
}

export default function ColaboradorFerias({ user }: { user: any }) {
  const [registros, setRegistros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("ferias_folgas")
          .select("*")
          .eq("colaborador_id", user.id)
          .order("data_inicio", { ascending: false })
          .limit(20)

        setRegistros(data || [])
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

  // Calculo simplificado de dias de ferias disponiveis
  const diasAdmissao = user.data_admissao
    ? Math.floor((Date.now() - new Date(user.data_admissao).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const diasDireito = Math.floor(diasAdmissao / 365) * 30
  const diasUsados = registros.filter(r => r.tipo === "ferias" && r.status === "aprovado")
    .reduce((acc: number, r: any) => {
      if (r.data_inicio && r.data_fim) {
        return acc + Math.ceil((new Date(r.data_fim).getTime() - new Date(r.data_inicio).getTime()) / (1000 * 60 * 60 * 24))
      }
      return acc
    }, 0)

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Ferias & Folgas</h2>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Acompanhe seus periodos de descanso</p>
      </div>

      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(8,145,178,0.12), rgba(0,0,0,0))" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px" }}>Dias de Direito</div>
          <div style={{ color: "#fff", fontSize: "26px", fontWeight: "700" }}>{diasDireito}</div>
        </div>
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(234,179,8,0.12), rgba(0,0,0,0))" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px" }}>Dias Usados</div>
          <div style={{ color: "#fff", fontSize: "26px", fontWeight: "700" }}>{diasUsados}</div>
        </div>
        <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(0,0,0,0))" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px" }}>Saldo</div>
          <div style={{ color: "#22c55e", fontSize: "26px", fontWeight: "700" }}>{diasDireito - diasUsados}</div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      ) : registros.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📅</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Nenhum registro</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>Seus periodos de ferias e folgas aparecerão aqui</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {registros.map((r: any, i: number) => {
            const st = statusConfig[r.status] || statusConfig.pendente
            const inicio = r.data_inicio ? new Date(r.data_inicio).toLocaleDateString("pt-BR") : "—"
            const fim = r.data_fim ? new Date(r.data_fim).toLocaleDateString("pt-BR") : "—"
            return (
              <div key={i} style={{
                ...cardStyle, padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600", textTransform: "capitalize" }}>{r.tipo || "Ferias"}</span>
                    <span style={{ padding: "2px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", background: st.bg, color: st.cor }}>{st.label}</span>
                  </div>
                  <div style={{ color: "#71717a", fontSize: "12px" }}>{inicio} → {fim}</div>
                  {r.observacao && <div style={{ color: "#52525b", fontSize: "11px", marginTop: "4px" }}>{r.observacao}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
