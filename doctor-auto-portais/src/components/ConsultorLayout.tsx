import { ReactNode, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useIsMobile } from "../lib/useIsMobile"

const COR = "#1d4ed8"

interface NavSection {
  title: string
  collapsible?: boolean
  items: { icon: string; label: string; key: string }[]
}

const sections: NavSection[] = [
  {
    title: "",
    items: [
      { icon: "📊", label: "Dashboard", key: "dashboard" },
      { icon: "🚗", label: "Patio", key: "patio" },
      { icon: "📅", label: "Agenda", key: "agendamentos" },
    ],
  },
  {
    title: "CADASTRO",
    collapsible: true,
    items: [
      { icon: "👤", label: "Clientes", key: "clientes" },
      { icon: "📋", label: "Ordens de Servico", key: "ordens" },
    ],
  },
  {
    title: "",
    items: [
      { icon: "💰", label: "Financeiro", key: "financeiro" },
      { icon: "📈", label: "Produtividade", key: "produtividade" },
      { icon: "📅", label: "Agenda Mec.", key: "agenda-mec" },
      { icon: "✅", label: "Avaliacao Diaria", key: "avaliacao-diaria" },
    ],
  },
]

export default function ConsultorLayout({ children, activeKey, onNavigate }: { children: ReactNode; activeKey: string; onNavigate: (k: string) => void }) {
  const { consultor, company, logout } = useAuth()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSection = (title: string) => {
    setCollapsed(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const allItems = sections.flatMap(s => s.items)

  const NavItem = ({ item }: { item: { icon: string; label: string; key: string } }) => {
    const active = activeKey === item.key
    return (
      <button onClick={() => { onNavigate(item.key); if (isMobile) setSidebarOpen(false) }} style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px",
        borderRadius: "10px", width: "100%", textAlign: "left",
        background: active ? COR : "transparent",
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

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199 }} />}

      <aside style={{ width: isMobile ? "260px" : "210px", minHeight: "100vh", background: "#111118", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 200, overflowY: "auto", transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)", transition: "transform 0.3s ease" }}>

        {/* Logo */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>DA</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>Doctor Auto</div>
            <div style={{ color: "#6b7280", fontSize: "11px" }}>Consultor</div>
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
        </div>

        {/* Nova OS Button */}
        <div style={{ padding: "12px 12px 8px" }}>
          <button onClick={() => onNavigate("nova-os")} style={{
            width: "100%", padding: "10px", background: COR, border: "none", borderRadius: "10px",
            color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
          }}>
            + Nova OS
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#4b5563", fontSize: "10px", marginBottom: "2px" }}>Logado como</div>
          <div style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "600" }}>{consultor?.nome?.split(" ").slice(0, 2).join(" ")}</div>
          <div style={{ color: "#6b7280", fontSize: "10px", marginBottom: "2px" }}>{company?.nome}</div>
          <button onClick={logout} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "500", padding: "0", fontFamily: "inherit" }}>
            ← Sair
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: isMobile ? 0 : "210px", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#111118", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "#e4e4e7", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}>☰</button>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "700", color: "#fff" }}>
              {allItems.find(n => n.key === activeKey)?.label || "Dashboard"}
            </h1>
            {!isMobile && <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>Visao geral em tempo real</p>}
          </div>
          <button onClick={() => onNavigate("nova-os")} style={{ padding: isMobile ? "8px 14px" : "10px 20px", background: COR, border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            + Nova OS
          </button>
        </header>
        <div style={{ flex: 1, padding: isMobile ? "16px" : "28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}

export function BtnPrimary({ onClick, children, disabled }: { onClick?: () => void; children: ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding: "10px 20px", background: disabled ? "rgba(29,78,216,0.4)" : "#1d4ed8", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{children}</button>
}
export function BtnSecondary({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return <button onClick={onClick} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>{children}</button>
}
