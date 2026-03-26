import { useState } from "react"

const COR = "#1d4ed8"

interface Agendamento {
  id: string
  codigo: string
  cliente: string
  data: string
  hora: string
  placa: string
  telefone: string
  veiculo: string
  servico: string
  status: "confirmado" | "pendente" | "reagendado" | "cancelado"
}

const MOCK: Agendamento[] = [
  { id: "1", codigo: "AGD-001", cliente: "Carlos Silva", data: "14/03/2026", hora: "09:00", placa: "ABC-1234", telefone: "(11) 98765-4321", veiculo: "Honda Civic 2020", servico: "Revisao Completa", status: "confirmado" },
  { id: "2", codigo: "AGD-002", cliente: "Maria Santos", data: "14/03/2026", hora: "10:30", placa: "XYZ-5678", telefone: "(11) 91234-5678", veiculo: "Toyota Corolla 2021", servico: "Troca de Oleo", status: "pendente" },
]

const statusConfig: Record<string, { label: string; bg: string; cor: string }> = {
  confirmado: { label: "Confirmado", bg: "rgba(16,185,129,0.15)", cor: "#10b981" },
  pendente: { label: "Pendente", bg: "rgba(245,158,11,0.15)", cor: "#f59e0b" },
  reagendado: { label: "Reagendado", bg: "rgba(59,130,246,0.15)", cor: "#3b82f6" },
  cancelado: { label: "Cancelado", bg: "rgba(239,68,68,0.15)", cor: "#ef4444" },
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(MOCK)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")

  const filtrados = agendamentos.filter(a => {
    const matchBusca = a.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      a.veiculo.toLowerCase().includes(busca.toLowerCase()) ||
      a.placa.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === "todos" || a.status === filtroStatus
    return matchBusca && matchStatus
  })

  const confirmar = (id: string) => setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: "confirmado" as const } : a))
  const reagendar = (id: string) => setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: "reagendado" as const } : a))
  const cancelar = (id: string) => setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: "cancelado" as const } : a))

  const totais = {
    total: agendamentos.length,
    pendentes: agendamentos.filter(a => a.status === "pendente").length,
    confirmados: agendamentos.filter(a => a.status === "confirmado").length,
    hoje: 0,
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
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>Agendamentos</h2>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Gerencie os agendamentos de servicos</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e4e4e7", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
            ↻ Atualizar
          </button>
          <button style={{ padding: "8px 16px", background: COR, border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            + Novo Agendamento
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total", valor: totais.total, cor: "#3b82f6" },
          { label: "Pendentes", valor: totais.pendentes, cor: "#f59e0b" },
          { label: "Confirmados", valor: totais.confirmados, cor: "#10b981" },
          { label: "Hoje", valor: totais.hoje, cor: "#e4e4e7" },
        ].map((k, i) => (
          <div key={i} style={{ ...cardStyle, borderColor: i === 0 ? "rgba(59,130,246,0.2)" : i === 1 ? "rgba(245,158,11,0.2)" : i === 2 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)" }}>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ color: k.cor, fontSize: "28px", fontWeight: "700" }}>{k.valor}</div>
          </div>
        ))}
      </div>

      {/* Busca + Filtro */}
      <div style={{ ...cardStyle, display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#6b7280" }}>🔍</span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por cliente, veiculo ou placa..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "#e4e4e7", fontSize: "13px", fontFamily: "inherit", outline: "none" }}>
          <option value="todos">Todos os Status</option>
          <option value="pendente">Pendentes</option>
          <option value="confirmado">Confirmados</option>
          <option value="reagendado">Reagendados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      {/* Cards de Agendamentos */}
      {filtrados.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>Nenhum agendamento encontrado</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {filtrados.map(ag => {
            const st = statusConfig[ag.status]
            return (
              <div key={ag.id} style={cardStyle}>
                {/* Header do card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>{ag.cliente}</div>
                    <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px" }}>{ag.codigo}</div>
                  </div>
                  <span style={{ padding: "3px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: st.bg, color: st.cor }}>
                    {st.label}
                  </span>
                </div>

                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" }}>
                    <span>📅</span> {ag.data}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" }}>
                    <span>🕐</span> {ag.hora}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" }}>
                    <span>🚗</span> {ag.placa}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px" }}>
                    <span>📞</span> {ag.telefone}
                  </div>
                </div>

                {/* Veiculo + Servico */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: "#52525b", fontSize: "11px", marginBottom: "2px" }}>Veiculo</div>
                  <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "500" }}>{ag.veiculo}</div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: "#52525b", fontSize: "11px", marginBottom: "2px" }}>Servico</div>
                  <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "500" }}>{ag.servico}</div>
                </div>

                {/* Botoes */}
                <div style={{ display: "grid", gridTemplateColumns: ag.status === "pendente" ? "1fr 1fr 1fr" : ag.status === "confirmado" ? "1fr 1fr" : "1fr", gap: "8px" }}>
                  {ag.status === "pendente" && (
                    <button onClick={() => confirmar(ag.id)} style={{
                      padding: "8px", background: "#10b981", border: "none", borderRadius: "8px",
                      color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "4px"
                    }}>
                      ✓ Confirmar
                    </button>
                  )}
                  {(ag.status === "pendente" || ag.status === "confirmado") && (
                    <button onClick={() => reagendar(ag.id)} style={{
                      padding: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: "8px", color: "#3b82f6", fontSize: "12px", fontWeight: "600",
                      cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px"
                    }}>
                      📅 Reagendar
                    </button>
                  )}
                  {ag.status !== "cancelado" && (
                    <button onClick={() => cancelar(ag.id)} style={{
                      padding: "8px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: "8px", color: "#ef4444", fontSize: "12px", fontWeight: "600",
                      cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px"
                    }}>
                      ✕ Cancelar
                    </button>
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
