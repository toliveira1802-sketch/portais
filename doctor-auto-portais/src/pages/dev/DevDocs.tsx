export default function DevDocs() {
  const docs = [
    { icon: "💻", title: "API Documentation", desc: "Documentacao completa da API REST", color: "#3b82f6" },
    { icon: "⌨️", title: "CLI Commands", desc: "Comandos disponiveis para desenvolvedores", color: "#10b981" },
    { icon: "🏗️", title: "Arquitetura", desc: "Visao geral da arquitetura do sistema", color: "#8b5cf6" },
    { icon: "📚", title: "Guias e Tutoriais", desc: "Guias passo a passo para desenvolvimento", color: "#f59e0b" },
  ]

  const links = [
    "Changelog e Versoes",
    "Roadmap de Desenvolvimento",
    "FAQ para Desenvolvedores",
    "Contribuindo com o Projeto",
  ]

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "24px",
  }

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "24px" }}>📖</span> Documentacao
      </h2>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Central de documentacao tecnica e guias</p>

      {/* Banner */}
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "18px" }}>⚠️</span>
        <div>
          <div style={{ color: "#fca5a5", fontSize: "14px", fontWeight: "600" }}>Em Desenvolvimento</div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>A documentacao esta sendo escrita. Os links abaixo ainda nao estao funcionais.</div>
        </div>
      </div>

      {/* Doc Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        {docs.map((doc, i) => (
          <div key={i} style={card}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${doc.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "16px" }}>
              {doc.icon}
            </div>
            <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>{doc.title}</h3>
            <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>{doc.desc}</p>
            <button style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
              Acessar Documentacao
            </button>
          </div>
        ))}
      </div>

      {/* Links Rapidos */}
      <div style={card}>
        <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Links Rapidos</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {links.map((link, i) => (
            <div key={i} style={{ color: "#9ca3af", fontSize: "14px" }}>→ {link}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
