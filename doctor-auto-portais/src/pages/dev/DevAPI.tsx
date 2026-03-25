export default function DevAPI() {
  const endpoints = [
    { method: "GET", path: "/api/users", latency: "45ms", requests: "1.2k", status: true },
    { method: "POST", path: "/api/auth/login", latency: "120ms", requests: "850", status: true },
    { method: "GET", path: "/api/vehicles", latency: "67ms", requests: "3.4k", status: true },
    { method: "POST", path: "/api/orders", latency: "89ms", requests: "2.1k", status: true },
    { method: "PUT", path: "/api/orders/:id", latency: "95ms", requests: "890", status: true },
    { method: "DELETE", path: "/api/orders/:id", latency: "150ms", requests: "120", status: true },
  ]

  const methodColors: Record<string, string> = {
    GET: "#10b981", POST: "#f59e0b", PUT: "#3b82f6", DELETE: "#ef4444"
  }

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "20px",
  }

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "24px" }}>🔌</span> API Management
      </h2>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Monitoramento e gerenciamento de endpoints</p>

      {/* Banner */}
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "18px" }}>⚠️</span>
        <div>
          <div style={{ color: "#fca5a5", fontSize: "14px", fontWeight: "600" }}>Em Desenvolvimento</div>
          <div style={{ color: "#9ca3af", fontSize: "13px" }}>Os dados de API abaixo sao simulados. Integracao com metricas reais em breve.</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total de Endpoints", valor: "24", sub: "Todos ativos", subColor: "#10b981" },
          { label: "Latencia Media", valor: "78ms", sub: "Ultima hora", subColor: "#6b7280" },
          { label: "Requests/min", valor: "142", sub: "+12% vs ontem", subColor: "#10b981" },
        ].map((k, i) => (
          <div key={i} style={card}>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "8px" }}>{k.label}</div>
            <div style={{ color: "#fff", fontSize: "28px", fontWeight: "700" }}>{k.valor}</div>
            <div style={{ color: k.subColor, fontSize: "12px", marginTop: "4px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Endpoints */}
      <div style={card}>
        <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Endpoints Disponiveis</h3>
        <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "16px" }}>Lista de todos os endpoints da API</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {endpoints.map((ep, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", background: `${methodColors[ep.method]}20`, color: methodColors[ep.method] }}>{ep.method}</span>
                <span style={{ color: "#e4e4e7", fontSize: "14px", fontFamily: "monospace" }}>{ep.path}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6b7280", fontSize: "10px" }}>Latencia</div>
                  <div style={{ color: "#e4e4e7", fontSize: "13px" }}>{ep.latency}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6b7280", fontSize: "10px" }}>Requests</div>
                  <div style={{ color: "#e4e4e7", fontSize: "13px" }}>{ep.requests}</div>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ep.status ? "#10b981" : "#ef4444" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
