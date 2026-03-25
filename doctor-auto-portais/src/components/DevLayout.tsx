import { ReactNode, useState } from "react"

const COR = "#ef4444"
const COR_ACTIVE = "#ef4444"

interface NavSection {
  title: string
  collapsible?: boolean
  items: { icon: string; label: string; key: string }[]
}

const sections: NavSection[] = [
  {
    title: "DEV",
    collapsible: true,
    items: [
      { icon: "📊", label: "/dev/painel", key: "dev-dashboard" },
      { icon: "🗺️", label: "Page Navigator", key: "dev-navigator" },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { icon: "📈", label: "Logs", key: "dev-logs" },
      { icon: "⚙️", label: "Configuracoes", key: "dev-config" },
      { icon: "📖", label: "Documentacao", key: "dev-docs" },
      { icon: "🔌", label: "API", key: "dev-api" },
      { icon: "🔑", label: "Permissoes", key: "dev-permissoes" },
      { icon: "🔗", label: "Integracoes", key: "dev-integracoes" },
    ],
  },
  {
    title: "IA",
    items: [
      { icon: "🧠", label: "IA QG", key: "dev-ia-qg" },
      { icon: "🎭", label: "Perfil IA", key: "dev-perfil-ia" },
      { icon: "💬", label: "IA Portal", key: "dev-ia-portal" },
    ],
  },
  {
    title: "DADOS",
    collapsible: true,
    items: [
      { icon: "📋", label: "Tables", key: "dev-tables" },
      { icon: "👥", label: "Users", key: "dev-usuarios" },
      { icon: "🗄️", label: "Database", key: "dev-banco" },
      { icon: "⌨️", label: "SQL Agent", key: "dev-sql" },
    ],
  },
  {
    title: "",
    items: [
      { icon: "⚡", label: "Processos", key: "dev-processos" },
      { icon: "🔧", label: "Ferramentas", key: "dev-ferramentas" },
    ],
  },
]

const sidebarLinks = [
  { icon: "⚙️", label: "SIDEBAR GESTAO", key: "sidebar-gestao" },
  { icon: "👤", label: "SIDEBAR CONSULTORES", key: "sidebar-consultor" },
  { icon: "🔧", label: "SIDEBAR MECANICOS", key: "sidebar-mecanico" },
]

export default function DevLayout({
  children, activeKey, onNavigate, onLogout, userName
}: {
  children: ReactNode
  activeKey: string
  onNavigate: (k: string) => void
  onLogout: () => void
  userName: string
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const allItems = sections.flatMap(s => s.items)

  const NavItem = ({ item }: { item: { icon: string; label: string; key: string } }) => {
    const active = activeKey === item.key
    return (
      <button onClick={() => onNavigate(item.key)} style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px",
        borderRadius: "10px", width: "100%", textAlign: "left",
        background: active ? COR_ACTIVE : "transparent",
        border: "none",
        color: active ? "#fff" : "#9ca3af",
        cursor: "pointer", fontSize: "13px", fontWeight: active ? "600" : "400",
        transition: "all 0.15s", fontFamily: "inherit"
      }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)" }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent" }}
      >
        <span style={{ fontSize: "14px", width: "20px", textAlign: "center" }}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Inter',sans-serif", color: "#e2e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}`}</style>

      {/* Sidebar */}
      <aside style={{ width: "210px", minHeight: "100vh", background: "#111118", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, overflowY: "auto" }}>

        {/* Logo */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>DA</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>Doctor Auto</div>
            <div style={{ color: "#6b7280", fontSize: "11px" }}>Painel DEV</div>
          </div>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, padding: "8px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {sections.map((section, si) => (
            <div key={si}>
              {section.title && (
                <div
                  onClick={() => section.collapsible && toggleSection(section.title)}
                  style={{
                    padding: "8px 14px 4px", color: "#4b5563", fontSize: "10px", fontWeight: "700",
                    letterSpacing: "1.2px", textTransform: "uppercase",
                    cursor: section.collapsible ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    userSelect: "none"
                  }}
                >
                  <span>{section.title}</span>
                  {section.collapsible && (
                    <span style={{ fontSize: "10px", transition: "transform 0.2s", transform: collapsed[section.title] ? "rotate(-90deg)" : "rotate(0)" }}>▼</span>
                  )}
                </div>
              )}
              {!collapsed[section.title] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {section.items.map(item => <NavItem key={item.key} item={item} />)}
                </div>
              )}
            </div>
          ))}

          {/* Sidebar Links */}
          <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {sidebarLinks.map(link => (
              <button key={link.key} onClick={() => onNavigate(link.key)} style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px",
                borderRadius: "10px", width: "100%", textAlign: "left",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#6b7280", cursor: "pointer", fontSize: "11px", fontWeight: "500",
                transition: "all 0.15s", fontFamily: "inherit"
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)" }}
              >
                <span style={{ fontSize: "12px" }}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#4b5563", fontSize: "10px", marginBottom: "2px" }}>Logado como</div>
          <div style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "600" }}>{userName}</div>
          <button onClick={onLogout} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "500", padding: "0", fontFamily: "inherit" }}>
            ← Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: "210px", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#111118", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>Empresa:</span>
              <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "600" }}>Doctor Auto Bosch</span>
              <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "600" }}>Doctor Auto Prime</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "500" }}>Online</span>
          </div>
        </header>
        <div style={{ flex: 1, padding: "28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}
