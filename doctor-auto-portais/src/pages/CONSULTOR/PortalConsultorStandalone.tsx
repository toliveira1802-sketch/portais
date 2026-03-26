import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

// ════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════
const theme = {
  bg: "#0a0a0a",
  bgCard: "#141414",
  bgSidebar: "#111111",
  bgHover: "#1a1a1a",
  accent: "#dc2626",
  accentHover: "#ef4444",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  textDim: "#71717a",
  border: "#27272a",
  success: "#22c55e",
  warning: "#eab308",
  info: "#3b82f6",
}

// ════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Digite seu nome")
      return
    }
    setLoading(true)
    setError("")
    const { data, error: err } = await supabase
      .from("colaboradores_portal_consultor")
      .select("*")
      .ilike("nome", `%${username.trim()}%`)
      .limit(1)
      .single()

    if (err || !data) {
      setError("Colaborador não encontrado")
      setLoading(false)
      return
    }
    if (!(data as any).ativo) {
      setError("Colaborador desativado")
      setLoading(false)
      return
    }
    onLogin(data)
  }

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg, display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "'Geist', system-ui, sans-serif",
    }}>
      <div style={{
        background: theme.bgCard, borderRadius: 16, padding: 40, width: 400,
        border: `1px solid ${theme.border}`, boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: theme.accent,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, fontSize: 24,
          }}>🔧</div>
          <h1 style={{ color: theme.text, fontSize: 22, fontWeight: 600, margin: 0 }}>Doctor Auto</h1>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: "4px 0 0" }}>Portal Consultor</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>NOME DO COLABORADOR</label>
          <input
            type="text" value={username} onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Ex: Thales" style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme.border}`,
              background: theme.bgHover, color: theme.text, fontSize: 14, outline: "none",
              boxSizing: "border-box" as const,
            }}
          />
        </div>

        {error && <p style={{ color: theme.accent, fontSize: 12, margin: "0 0 12px", textAlign: "center" }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: 12, borderRadius: 8, border: "none", cursor: "pointer",
          background: theme.accent, color: "#fff", fontSize: 14, fontWeight: 600,
          opacity: loading ? 0.6 : 1, transition: "all 0.2s",
        }}>
          {loading ? "Entrando..." : "Acessar Sistema →"}
        </button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════
function Sidebar({ active, onNavigate, user }: { active: string; onNavigate: (id: string) => void; user: any }) {
  const items = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "patio", icon: "🏗️", label: "Pátio" },
    { id: "nova-os", icon: "➕", label: "Nova OS" },
    { id: "os-lista", icon: "📋", label: "Ordens de Serviço" },
    { id: "clientes", icon: "👤", label: "Clientes" },
    { id: "agenda", icon: "📅", label: "Agendamentos" },
    { id: "pendencias", icon: "⚠️", label: "Pendências" },
    { id: "financeiro", icon: "💰", label: "Financeiro" },
  ]

  return (
    <div style={{
      width: 220, height: "100vh", background: theme.bgSidebar, borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      <div style={{ padding: "20px 16px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: theme.accent,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🔧</div>
          <div>
            <div style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>Doctor Auto</div>
            <div style={{ color: theme.textDim, fontSize: 10 }}>Portal Consultor</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 2,
            background: active === item.id ? "rgba(220,38,38,0.1)" : "transparent",
            color: active === item.id ? theme.accent : theme.textMuted,
            fontSize: 13, fontWeight: active === item.id ? 600 : 400, transition: "all 0.15s",
            textAlign: "left" as const,
          }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 16px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ color: theme.text, fontSize: 12, fontWeight: 500 }}>{user?.nome?.split(" ").slice(0, 2).join(" ")}</div>
        <div style={{ color: theme.textDim, fontSize: 10, textTransform: "capitalize" as const }}>{user?.cargo}</div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// STAT CARD
// ════════════════════════════════════════════
function StatCard({ icon, label, value, sublabel, color = theme.textMuted }: { icon: string; label: string; value: string | number; sublabel?: string; color?: string }) {
  return (
    <div style={{
      background: theme.bgCard, borderRadius: 12, padding: "20px 20px",
      border: `1px solid ${theme.border}`, flex: 1, minWidth: 180,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ color: theme.text, fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>{value}</div>
      {sublabel && <div style={{ color, fontSize: 11, marginTop: 4 }}>{sublabel}</div>}
    </div>
  )
}

// ════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════
function DashboardPage() {
  const [stats, setStats] = useState({ colaboradores: 0, roles: 0 })

  useEffect(() => {
    async function load() {
      const [c1, c2] = await Promise.all([
        supabase.from("colaboradores_portal_consultor").select("id", { count: "exact", head: true }),
        supabase.from("nivel_acesso").select("role", { count: "exact", head: true }),
      ])
      setStats({ colaboradores: c1.count || 0, roles: c2.count || 0 })
    }
    load()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: 0 }}>Dashboard</h2>
        <p style={{ color: theme.textMuted, fontSize: 13, margin: "4px 0 0" }}>
          Visão geral do sistema — {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Colaboradores" value={stats.colaboradores} sublabel="Total cadastrados" color={theme.info} />
        <StatCard icon="🔐" label="Perfis" value={stats.roles} sublabel="Níveis de acesso" color={theme.success} />
        <StatCard icon="📋" label="OS Hoje" value="—" sublabel="Aguardando tabela 05" color={theme.warning} />
      </div>

      <div style={{
        background: theme.bgCard, borderRadius: 12, padding: 24,
        border: `1px solid ${theme.border}`,
      }}>
        <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>Schema V1 — Progresso</h3>
        {[
          { name: "colaboradores_portal_consultor", status: "ok", rows: stats.colaboradores },
          { name: "nivel_acesso", status: "ok", rows: stats.roles },
          { name: "clientes", status: "ok" },
          { name: "veiculos", status: "ok" },
          { name: "ordens_servico", status: "ok" },
        ].map(t => (
          <div key={t.name} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0", borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: t.status === "ok" ? theme.success : theme.textDim,
              }} />
              <span style={{ color: theme.text, fontSize: 13, fontFamily: "monospace" }}>{t.name}</span>
            </div>
            <span style={{
              color: t.status === "ok" ? theme.success : theme.textDim, fontSize: 11,
              background: t.status === "ok" ? "rgba(34,197,94,0.1)" : "rgba(113,113,122,0.1)",
              padding: "2px 8px", borderRadius: 4,
            }}>
              {t.status === "ok" ? `${t.rows} rows` : "aguardando"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// PLACEHOLDER PAGES
// ════════════════════════════════════════════
function PlaceholderPage({ title, icon, description, table }: { title: string; icon: string; description: string; table?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <span style={{ fontSize: 48, marginBottom: 16 }}>{icon}</span>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>{title}</h2>
      <p style={{ color: theme.textMuted, fontSize: 13, margin: 0, textAlign: "center", maxWidth: 400 }}>{description}</p>
      {table && (
        <div style={{
          marginTop: 16, padding: "8px 16px", borderRadius: 8,
          background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)",
        }}>
          <span style={{ color: theme.accent, fontSize: 12, fontFamily: "monospace" }}>Aguardando: {table}</span>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════
// CLIENTES PAGE
// ════════════════════════════════════════════
function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tableExists, setTableExists] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error && (error as any).code === "42P01") {
        setTableExists(false)
      } else {
        setTableExists(true)
        setClientes(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ color: theme.textMuted, padding: 40 }}>Carregando...</div>

  if (!tableExists) {
    return <PlaceholderPage title="Clientes" icon="👤" description="Tabela clientes ainda não foi criada no Supabase." table="clientes" />
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: 0 }}>Clientes</h2>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: "4px 0 0" }}>{clientes.length} clientes cadastrados</p>
        </div>
        <button style={{
          padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
          background: theme.accent, color: "#fff", fontSize: 13, fontWeight: 600,
        }}>+ Novo Cliente</button>
      </div>

      <div style={{ background: theme.bgCard, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Nome", "Telefone", "Email", "Cidade", "Origem"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left" as const, color: theme.textMuted, fontWeight: 500, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: theme.textDim }}>Nenhum cliente cadastrado</td></tr>
            ) : clientes.map((c: any) => (
              <tr key={c.id_cliente} style={{ borderBottom: `1px solid ${theme.border}`, cursor: "pointer" }}>
                <td style={{ padding: "12px 16px", color: theme.text, fontWeight: 500 }}>{c.nome}</td>
                <td style={{ padding: "12px 16px", color: theme.textMuted }}>{c.telefone || "—"}</td>
                <td style={{ padding: "12px 16px", color: theme.textMuted }}>{c.email || "—"}</td>
                <td style={{ padding: "12px 16px", color: theme.textMuted }}>{c.cidade || "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 11,
                    background: "rgba(59,130,246,0.1)", color: theme.info,
                  }}>{c.origem || "manual"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════
// MAIN PORTAL CONSULTOR STANDALONE
// ════════════════════════════════════════════
export default function PortalConsultorStandalone() {
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState("dashboard")

  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />
      case "clientes": return <ClientesPage />
      case "patio": return <PlaceholderPage title="Pátio Kanban" icon="🏗️" description="Acompanhe os veículos na oficina em tempo real. Arraste entre colunas para mudar o status." table="05_ordens_servico" />
      case "nova-os": return <PlaceholderPage title="Nova OS" icon="➕" description="Abra uma nova Ordem de Serviço. Selecione cliente, veículo e adicione serviços." table="05_ordens_servico" />
      case "os-lista": return <PlaceholderPage title="Ordens de Serviço" icon="📋" description="Lista completa de todas as OS. Filtre por status, mecânico ou data." table="05_ordens_servico" />
      case "agenda": return <PlaceholderPage title="Agendamentos" icon="📅" description="Calendário de agendamentos da oficina." table="15_agendamentos (futuro)" />
      case "pendencias": return <PlaceholderPage title="Pendências" icon="⚠️" description="Itens que precisam de atenção — aprovações, peças, retornos." table="13_pendencias (futuro)" />
      case "financeiro": return <PlaceholderPage title="Financeiro" icon="💰" description="Faturamento, pagamentos e relatórios financeiros." table="faturamento (futuro)" />
      default: return <DashboardPage />
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'Geist', system-ui, sans-serif" }}>
      <Sidebar active={page} onNavigate={setPage} user={user} />
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {renderPage()}
      </div>
    </div>
  )
}
