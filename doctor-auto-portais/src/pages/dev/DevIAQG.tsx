export default function DevIAQG() {
  const leads = [
    { nome: "Joao Silva", temp: "Quente", status: "Agendado", tel: "(11) 98888-7777", origem: "Instagram", contato: "Hoje, 14:30", consultor: "Maria", score: 92, conversao: 85 },
    { nome: "Pedro Costa", temp: "Quente", status: "Novo", tel: "(11) 97777-6666", origem: "Google Ads", contato: "Hoje, 10:15", consultor: null, score: 88, conversao: 78 },
    { nome: "Ana Oliveira", temp: "Morno", status: "Em negociacao", tel: "(11) 96666-5555", origem: "Indicacao", contato: "Ontem, 16:45", consultor: "Joao", score: 65, conversao: 55 },
    { nome: "Carlos Souza", temp: "Frio", status: "Sem resposta", tel: "(11) 95555-4444", origem: "Facebook", contato: "3 dias atras", consultor: null, score: 42, conversao: 25 },
    { nome: "Juliana Lima", temp: "Quente", status: "Orcamento enviado", tel: "(11) 94444-3333", origem: "Google Ads", contato: "Hoje, 11:00", consultor: "Maria", score: 90, conversao: 82 },
  ]

  const tempColors: Record<string, string> = { Quente: "#ef4444", Morno: "#f59e0b", Frio: "#3b82f6" }

  const totalLeads = leads.length
  const quentes = leads.filter(l => l.temp === "Quente").length
  const mornos = leads.filter(l => l.temp === "Morno").length
  const frios = leads.filter(l => l.temp === "Frio").length

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "20px",
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🧠</span> IA QG - Lead Scoring
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Analise inteligente e distribuicao automatica de leads</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ padding: "8px 18px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "8px", color: "#a78bfa", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>🧠 Analisar Lote</button>
          <button style={{ padding: "8px 18px", background: "#ef4444", border: "none", borderRadius: "8px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>⚡ Distribuir Leads</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total de Leads", valor: totalLeads.toString(), sub: `+8 hoje`, subColor: "#10b981", bg: "" },
          { label: "Leads Quentes", valor: quentes.toString(), sub: "Score medio: 89", subColor: "#6b7280", bg: "rgba(59,130,246,0.08)" },
          { label: "Taxa de Conversao", valor: "42%", sub: "+5% vs mes anterior", subColor: "#10b981", bg: "rgba(16,185,129,0.08)" },
          { label: "Sem Consultor", valor: leads.filter(l => !l.consultor).length.toString(), sub: "Aguardando atribuicao", subColor: "#f59e0b", bg: "rgba(239,68,68,0.08)" },
        ].map((k, i) => (
          <div key={i} style={{ ...card, background: k.bg || card.background }}>
            <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "8px" }}>{k.label}</div>
            <div style={{ color: "#fff", fontSize: "28px", fontWeight: "700" }}>{k.valor}</div>
            <div style={{ color: k.subColor, fontSize: "12px", marginTop: "4px" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={card}>
          <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>🌡️ Distribuicao por Temperatura</h3>
          <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "16px" }}>Classificacao automatica por IA</p>
          {[
            { label: "Quente (Score 80-100)", count: quentes, color: "#ef4444", pct: quentes / totalLeads },
            { label: "Morno (Score 50-79)", count: mornos, color: "#f59e0b", pct: mornos / totalLeads },
            { label: "Frio (Score 0-49)", count: frios, color: "#3b82f6", pct: frios / totalLeads },
          ].map((t, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color }} />
                  <span style={{ color: "#e4e4e7", fontSize: "13px" }}>{t.label}</span>
                </div>
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>{t.count}</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: `${t.pct * 100}%`, background: t.color, borderRadius: "3px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={card}>
          <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>📊 Distribuicao por Consultor</h3>
          <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "16px" }}>Performance da equipe</p>
          <div style={{ color: "#52525b", fontSize: "13px", textAlign: "center", padding: "40px" }}>Grafico em desenvolvimento</div>
        </div>
      </div>

      {/* Leads Table */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>Leads ({totalLeads})</h3>
            <p style={{ color: "#6b7280", fontSize: "11px" }}>Classificacao automatica por IA com lead scoring</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {leads.map((lead, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{lead.nome}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", background: `${tempColors[lead.temp]}20`, color: tempColors[lead.temp] }}>🌡️ {lead.temp}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>{lead.status}</span>
                </div>
                <div style={{ display: "flex", gap: "16px", color: "#6b7280", fontSize: "12px" }}>
                  <span>{lead.tel}</span>
                  <span>Origem: {lead.origem}</span>
                  <span>Ultimo contato: {lead.contato}</span>
                  {lead.consultor && <span style={{ color: "#3b82f6" }}>Consultor: {lead.consultor}</span>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: tempColors[lead.temp], fontSize: "18px", fontWeight: "700" }}>{lead.score}</div>
                  <div style={{ color: "#52525b", fontSize: "10px" }}>Score IA</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "#e4e4e7", fontSize: "18px", fontWeight: "700" }}>{lead.conversao}%</div>
                  <div style={{ color: "#52525b", fontSize: "10px" }}>Conversao</div>
                </div>
                <button style={{ padding: "6px 16px", borderRadius: "8px", background: "#ef4444", border: "none", color: "#fff", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>Atribuir</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "20px" }}>
        {[
          { icon: "💡", title: "Insight IA", msg: "Leads do Google Ads tem 23% mais taxa de conversao. Considere aumentar investimento.", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
          { icon: "✅", title: "Recomendacao", msg: "5 leads quentes sem consultor. Distribua imediatamente para aumentar conversao.", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
          { icon: "⚠️", title: "Alerta", msg: "6 leads frios ha mais de 7 dias. Execute campanha de reativacao automatizada.", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
        ].map((insight, i) => (
          <div key={i} style={{ background: insight.bg, border: `1px solid ${insight.border}`, borderRadius: "12px", padding: "18px" }}>
            <h4 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>{insight.icon} {insight.title}</h4>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.5" }}>{insight.msg}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
