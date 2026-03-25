export default function DevLogs() {
  const logs = [
    { type: "INFO", source: "System", msg: "Sistema iniciado com sucesso", time: "20/03/2026, 05:53:23", color: "#3b82f6" },
    { type: "SUCCESS", source: "Database", msg: "Conexao com banco de dados estabelecida", time: "20/03/2026, 05:52:23", color: "#10b981" },
    { type: "WARNING", source: "Performance", msg: "Uso de memoria em 75%", time: "20/03/2026, 05:51:23", color: "#f59e0b" },
  ]

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "20px",
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📈</span> Logs do Sistema
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Monitoramento em tempo real de atividades e eventos</p>
        </div>
        <button style={{ padding: "8px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e4e4e7", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
          🔄 Atualizar
        </button>
      </div>

      {/* Banner em desenvolvimento */}
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "18px" }}>⚠️</span>
        <div>
          <div style={{ color: "#fca5a5", fontSize: "14px", fontWeight: "600" }}>Em Desenvolvimento</div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>Esta funcionalidade esta sendo implementada. Os logs abaixo sao apenas exemplos.</div>
        </div>
      </div>

      {/* Logs */}
      <div style={card}>
        <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Logs Recentes</h3>
        <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "20px" }}>Ultimas atividades registradas no sistema</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px" }}>{log.type === "INFO" ? "ℹ️" : log.type === "SUCCESS" ? "✅" : "⚠️"}</span>
                <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", background: `${log.color}20`, color: log.color }}>{log.type}</span>
                <span style={{ color: "#6b7280", fontSize: "12px" }}>{log.source}</span>
              </div>
              <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "500" }}>{log.msg}</div>
              <div style={{ color: "#52525b", fontSize: "12px", marginTop: "4px" }}>{log.time}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#3f3f46", fontSize: "13px", marginTop: "32px" }}>
        Sistema de logs em desenvolvimento. Mais funcionalidades em breve.
      </p>
    </div>
  )
}
