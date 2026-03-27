import { ReactNode, useState } from "react"
import { useIsMobile } from "../lib/useIsMobile"

const COR = "#0891b2" // cyan-600

interface NavSection {
  title: string
  collapsible?: boolean
  items: { icon: string; label: string; key: string }[]
}

const sections: NavSection[] = [
  {
    title: "",
    items: [
      { icon: "📊", label: "Dashboard", key: "colab-dashboard" },
      { icon: "⏰", label: "Meu Ponto", key: "colab-ponto" },
      { icon: "📋", label: "Minhas OS", key: "colab-os" },
    ],
  },
  {
    title: "FINANCEIRO",
    collapsible: true,
    items: [
      { icon: "💰", label: "Holerite", key: "colab-holerite" },
      { icon: "🎯", label: "Comissoes", key: "colab-comissoes" },
    ],
  },
  {
    title: "GERAL",
    collapsible: true,
    items: [
      { icon: "📢", label: "Comunicados", key: "colab-comunicados" },
      { icon: "📅", label: "Ferias / Folgas", key: "colab-ferias" },
      { icon: "👤", label: "Meu Perfil", key: "colab-perfil" },
    ],
  },
]

export default function ColaboradorLayout({
  children,
  activeKey,
  onNavigate,
  onLogout,
  userName,
  userCargo,
}: {
  children: ReactNode
  activeKey: string
  onNavigate: (k: string) => void
  onLogout: () => void
  userName: string
  userCargo?: string
}) {
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

      {isMobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199 }} />}

      <aside style={{ width: isMobile ? "260px" : "210px", minHeight: "100vh", background: "#111118", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 200, overflowY: "auto", transform: isMobile && !sidebarOpen ? "translateX(-100%)" : "translateX(0)", transition: "transform 0.3s ease" }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>DA</div>
          <div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>Doctor Auto</div>
            <div style={{ color: "#6b7280", fontSize: "11px" }}>Colaborador</div>
          </div>
        </div>

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

        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#4b5563", fontSize: "10px", marginBottom: "2px" }}>Logado como</div>
          <div style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "600" }}>{userName}</div>
          {userCargo && <div style={{ color: "#6b7280", fontSize: "10px", marginBottom: "2px" }}>{userCargo}</div>}
          <button onClick={onLogout} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "500", padding: "0", fontFamily: "inherit" }}>
            ← Sair
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: isMobile ? 0 : "210px", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: isMobile ? "12px 16px" : "14px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#111118", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "#e4e4e7", fontSize: "20px", cursor: "pointer", padding: "4px 8px" }}>☰</button>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "700", color: "#fff" }}>
              {allItems.find(n => n.key === activeKey)?.label || "Dashboard"}
            </h1>
            {!isMobile && <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>Portal do Colaborador</p>}
          </div>
        </header>
        <div style={{ flex: 1, padding: isMobile ? "16px" : "28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}