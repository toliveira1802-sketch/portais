import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COR = "#10b981"

interface TableCount {
  tabela: string
  total: number
}

interface PortalStatus {
  nome: string
  cor: string
  tabela: string
  total: number
  authReal: boolean
}

export default function DevDashboard({ onNavigate }: { onNavigate: (k: string) => void }) {
  const [tableCounts, setTableCounts] = useState<TableCount[]>([])
  const [portais, setPortais] = useState<PortalStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [dbSize, setDbSize] = useState({ tabelas: 0, totalRows: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const tables = [
        { tabela: "companies", label: "Companies" },
        { tabela: "colaboradores_portal_consultor", label: "Consultores" },
        { tabela: "colaboradores_portal_gestao", label: "Gestao" },
        { tabela: "colaboradores_portal_mecanico", label: "Mecanicos" },
        { tabela: "colaboradores_portal_dev", label: "Devs" },
        { tabela: "clientes", label: "Clientes" },
        { tabela: "veiculos", label: "Veiculos" },
        { tabela: "ordens_servico", label: "Ordens Servico" },
        { tabela: "workflow_etapas", label: "Workflow Etapas" },
        { tabela: "nivel_acesso", label: "Nivel Acesso" },
      ]

      const counts: TableCount[] = []
      for (const t of tables) {
        const { count } = await supabase.from(t.tabela).select("*", { count: "exact", head: true })
        counts.push({ tabela: t.label, total: count || 0 })
      }
      setTableCounts(counts)

      const totalRows = counts.reduce((acc, c) => acc + c.total, 0)
      setDbSize({ tabelas: counts.length, totalRows })

      setPortais([
        { nome: "Consultor", cor: "#1d4ed8", tabela: "colaboradores_portal_consultor", total: counts.find(c => c.tabela === "Consultores")?.total || 0, authReal: true },
        { nome: "Gestao", cor: "#7c3aed", tabela: "colaboradores_portal_gestao", total: counts.find(c => c.tabela === "Gestao")?.total || 0, authReal: false },
        { nome: "Mecanico", cor: "#ea580c", tabela: "colaboradores_portal_mecanico", total: counts.find(c => c.tabela === "Mecanicos")?.total || 0, authReal: false },
        { nome: "Cliente", cor: "#0d9488", tabela: "clientes", total: counts.find(c => c.tabela === "Clientes")?.total || 0, authReal: false },
        { nome: "Developer", cor: "#10b981", tabela: "colaboradores_portal_dev", total: counts.find(c => c.tabela === "Devs")?.total || 0, authReal: false },
      ])
    } catch (err) {
      console.error("Erro ao buscar stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#52525b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "28px", height: "28px", border: `2px solid rgba(16,185,129,0.3)`, borderTop: `2px solid ${COR}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
          Carregando dados do sistema...
        </div>
      </div>
    )
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>{saudacao}, Dev</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Painel de administracao do sistema Doctor Auto</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Tabelas", valor: dbSize.tabelas, icon: "🗄️" },
          { label: "Total Rows", valor: dbSize.totalRows, icon: "📊" },
          { label: "Portais Ativos", valor: 5, icon: "🌐" },
          { label: "Auth Supabase", valor: portais.filter(p => p.authReal).length + "/" + portais.length, icon: "🔐" },
        ].map((kpi, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{kpi.label}</div>
                <div style={{ color: "#fff", fontSize: "28px", fontWeight: "700" }}>{kpi.valor}</div>
              </div>
              <span style={{ fontSize: "24px" }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Portais Status */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "14px" }}>Status dos Portais</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {portais.map((p, i) => (
            <div key={i} style={{ ...cardStyle, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = p.cor}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.cor }} />
                <span style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{p.nome}</span>
              </div>
              <div style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{p.total}</div>
              <div style={{ color: "#6b7280", fontSize: "12px" }}>colaboradores</div>
              <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.authReal ? "#10b981" : "#f59e0b" }} />
                <span style={{ color: p.authReal ? "#10b981" : "#f59e0b", fontSize: "11px" }}>
                  {p.authReal ? "Auth Real" : "Auth Mock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabelas do Banco */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600" }}>Banco de Dados</h3>
          <button onClick={() => onNavigate("dev-banco")} style={{ background: "transparent", border: `1px solid ${COR}`, borderRadius: "8px", color: COR, padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
            Ver Detalhes
          </button>
        </div>
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Tabela</th>
                <th style={{ textAlign: "right", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Rows</th>
                <th style={{ textAlign: "right", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tableCounts.map((t, i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 12px", color: "#e4e4e7", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{t.tabela}</td>
                  <td style={{ padding: "10px 12px", color: "#fff", fontSize: "13px", fontWeight: "600", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{t.total}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "500",
                      background: t.total > 0 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      color: t.total > 0 ? "#10b981" : "#f59e0b"
                    }}>
                      {t.total > 0 ? "Populada" : "Vazia"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acoes Rapidas */}
      <div>
        <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "14px" }}>Acoes Rapidas</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { icon: "👥", label: "Gerenciar Usuarios", key: "dev-usuarios" },
            { icon: "🗄️", label: "Explorar Banco", key: "dev-banco" },
            { icon: "📋", label: "Ver Logs", key: "dev-logs" },
            { icon: "🔧", label: "Workflow", key: "dev-workflow" },
          ].map((a, i) => (
            <button key={i} onClick={() => onNavigate(a.key)} style={{
              ...cardStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
              transition: "all 0.15s", border: "1px solid rgba(255,255,255,0.08)"
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = COR}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <span style={{ fontSize: "24px" }}>{a.icon}</span>
              <span style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "500" }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
