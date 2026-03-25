import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getOrdensServico } from "../lib/supabase"

const COR = "#1d4ed8"

const statusConfig: Record<string, { label: string; bg: string; cor: string }> = {
  aberta: { label: "Aberta", bg: "rgba(59,130,246,0.15)", cor: "#3b82f6" },
  em_andamento: { label: "Em Andamento", bg: "rgba(245,158,11,0.15)", cor: "#f59e0b" },
  aguardando_peca: { label: "Aguard. Peca", bg: "rgba(249,115,22,0.15)", cor: "#f97316" },
  aguardando_aprovacao: { label: "Aguard. Aprovacao", bg: "rgba(168,85,247,0.15)", cor: "#a855f7" },
  finalizada: { label: "Finalizada", bg: "rgba(16,185,129,0.15)", cor: "#10b981" },
  entregue: { label: "Entregue", bg: "rgba(16,185,129,0.15)", cor: "#10b981" },
  cancelada: { label: "Cancelada", bg: "rgba(239,68,68,0.15)", cor: "#ef4444" },
}

export default function OrdensPagina({ onNavigate }: { onNavigate: (k: string) => void }) {
  const { consultor } = useAuth()
  const [ordens, setOrdens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")

  useEffect(() => {
    if (consultor?.empresa_id) {
      getOrdensServico(consultor.empresa_id).then(data => { setOrdens(data || []); setLoading(false) }).catch(() => setLoading(false))
    }
  }, [consultor])

  const filtradas = ordens.filter(os => {
    const matchBusca = (os.numero_os || "").toLowerCase().includes(busca.toLowerCase()) ||
      (os.cliente?.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
      (os.veiculo?.placa || "").toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === "todos" || os.status === filtroStatus
    return matchBusca && matchStatus
  })

  const totais = {
    total: ordens.length,
    abertas: ordens.filter(o => ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"].includes(o.status)).length,
    finalizadas: ordens.filter(o => o.status === "finalizada" || o.status === "entregue").length,
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>Ordens de Servico</h2>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>{ordens.length} ordens registradas</p>
        </div>
        <button onClick={() => onNavigate("nova-os")} style={{
          padding: "10px 18px", background: COR, border: "none", borderRadius: "10px",
          color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
        }}>
          + Nova OS
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total OS", valor: totais.total, cor: "#3b82f6" },
          { label: "Em Andamento", valor: totais.abertas, cor: "#f59e0b" },
          { label: "Finalizadas", valor: totais.finalizadas, cor: "#10b981" },
        ].map((k, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ color: k.cor, fontSize: "28px", fontWeight: "700" }}>{k.valor}</div>
          </div>
        ))}
      </div>

      {/* Busca + Filtro */}
      <div style={{ ...cardStyle, display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#6b7280" }}>🔍</span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por numero, cliente ou placa..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "#e4e4e7", fontSize: "13px", fontFamily: "inherit", outline: "none" }}>
          <option value="todos">Todos os Status</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Carregando ordens...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              {ordens.length === 0 ? "Nenhuma OS registrada ainda" : "Nenhum resultado encontrado"}
            </div>
            {ordens.length === 0 && (
              <button onClick={() => onNavigate("nova-os")} style={{
                marginTop: "16px", padding: "10px 20px", background: COR, border: "none", borderRadius: "10px",
                color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
              }}>
                + Criar primeira OS
              </button>
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["OS", "Cliente", "Veiculo", "Placa", "Status", "Data"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(os => {
                const st = statusConfig[os.status] || statusConfig.aberta
                return (
                  <tr key={os.id_os} style={{ cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: COR, fontSize: "13px", fontWeight: "600", fontFamily: "monospace" }}>{os.numero_os}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#e4e4e7", fontSize: "13px" }}>{os.cliente?.nome || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#9ca3af", fontSize: "13px" }}>{os.veiculo ? `${os.veiculo.marca} ${os.veiculo.modelo}` : "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#9ca3af", fontSize: "13px", fontFamily: "monospace" }}>{os.veiculo?.placa || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "500", background: st.bg, color: st.cor }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#6b7280", fontSize: "12px" }}>
                      {os.data_entrada ? new Date(os.data_entrada).toLocaleDateString("pt-BR") : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
