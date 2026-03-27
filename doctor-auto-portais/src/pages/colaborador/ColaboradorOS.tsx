import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const statusConfig: Record<string, { label: string; cor: string; bg: string }> = {
  aberta: { label: "Aberta", cor: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  em_andamento: { label: "Em Andamento", cor: "#eab308", bg: "rgba(234,179,8,0.1)" },
  aguardando_peca: { label: "Aguardando Peca", cor: "#f97316", bg: "rgba(249,115,22,0.1)" },
  aguardando_aprovacao: { label: "Aguardando Aprovacao", cor: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  finalizada: { label: "Finalizada", cor: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  entregue: { label: "Entregue", cor: "#6b7280", bg: "rgba(107,114,128,0.1)" },
}

export default function ColaboradorOS({ user }: { user: any }) {
  const [ordens, setOrdens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<"ativas" | "todas">("ativas")

  useEffect(() => {
    loadOrdens()
  }, [filtro])

  async function loadOrdens() {
    setLoading(true)
    try {
      let query = supabase
        .from("ordens_servico")
        .select("*, cliente:id_cliente(nome,telefone), veiculo:id_veiculo(placa,marca,modelo)")
        .eq("id_mecanico", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (filtro === "ativas") {
        query = query.in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"])
      }

      const { data } = await query
      setOrdens(data || [])
    } catch {
      // tabela pode nao existir
    } finally {
      setLoading(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      {/* Header com filtros */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Minhas Ordens de Servico</h2>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>{ordens.length} {filtro === "ativas" ? "ativas" : "no total"}</p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["ativas", "todas"] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: filtro === f ? "#0891b2" : "rgba(255,255,255,0.05)",
              color: filtro === f ? "#fff" : "#9ca3af",
              fontSize: "12px", fontWeight: "600", fontFamily: "inherit", textTransform: "capitalize",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      ) : ordens.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Nenhuma OS encontrada</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>
            {filtro === "ativas" ? "Voce nao tem ordens ativas no momento" : "Nenhuma ordem atribuida a voce"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ordens.map((os: any) => {
            const st = statusConfig[os.status] || { label: os.status, cor: "#71717a", bg: "rgba(113,113,122,0.1)" }
            return (
              <div key={os.id_os} style={{
                ...cardStyle, padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: "16px", flexWrap: "wrap",
              }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                      OS #{String(os.numero_os || os.id_os).slice(-6)}
                    </span>
                    <span style={{
                      padding: "2px 10px", borderRadius: "6px", fontSize: "11px",
                      fontWeight: "600", background: st.bg, color: st.cor,
                    }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ color: "#9ca3af", fontSize: "12px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {os.cliente?.nome && <span>👤 {os.cliente.nome}</span>}
                    {os.veiculo && <span>🚗 {os.veiculo.placa} - {os.veiculo.marca} {os.veiculo.modelo}</span>}
                  </div>
                  {os.descricao_problema && (
                    <div style={{ color: "#71717a", fontSize: "12px", marginTop: "6px", lineHeight: "1.4" }}>
                      {os.descricao_problema.slice(0, 120)}{os.descricao_problema.length > 120 ? "..." : ""}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {os.data_entrada && (
                    <div style={{ color: "#71717a", fontSize: "11px" }}>
                      Entrada: {new Date(os.data_entrada).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                  {os.valor_final && (
                    <div style={{ color: "#22c55e", fontSize: "14px", fontWeight: "700", marginTop: "4px" }}>
                      R$ {Number(os.valor_final).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
