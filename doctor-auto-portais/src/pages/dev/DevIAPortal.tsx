import { useState } from "react"

interface Agent {
  name: string
  role: string
  desc: string
  color: string
  greeting: string
}

const agents: Agent[] = [
  { name: "Sophia", role: "Gestao & Processos", desc: "Especialista em gestao, processos e melhoria continua", color: "#7c3aed", greeting: "Ola! Sou a Sophia, sua assistente de Gestao e Processos. Como posso ajudar voce hoje?" },
  { name: "Simone", role: "Qualidade & Analytics", desc: "Analista de dados e controle de qualidade", color: "#3b82f6", greeting: "Ola! Sou a Simone, especialista em qualidade e analytics. Como posso ajudar?" },
  { name: "Raena", role: "Lead Scoring & CRM", desc: "Especialista em vendas e relacionamento com clientes", color: "#10b981", greeting: "Ola! Sou a Raena, sua assistente de vendas e CRM. Como posso ajudar?" },
]

export default function DevIAPortal() {
  const [selected, setSelected] = useState(0)
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([])
  const [input, setInput] = useState("")

  const agent = agents[selected]

  const initMessages = [
    { from: agent.name, text: agent.greeting, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }
  ]

  const displayMessages = messages.length === 0 ? initMessages : messages

  const quickActions = ["Analisar OS", "Sugerir Melhorias", "Insights"]

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "24px" }}>🤖</span> Portal IA Multi-Agente
      </h2>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Chat com 3 assistentes especializadas: Sophia, Simone e Raena</p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", minHeight: "500px" }}>
        {/* Left Panel - Agent Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }}>
            <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Agentes Disponiveis</h3>
            <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "16px" }}>Escolha sua assistente</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {agents.map((a, i) => (
                <button key={i} onClick={() => { setSelected(i); setMessages([]) }} style={{
                  padding: "14px", borderRadius: "12px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  background: selected === i ? `${a.color}15` : "rgba(255,255,255,0.02)",
                  border: selected === i ? `1px solid ${a.color}40` : "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.15s"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: a.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "700" }}>{a.name[0]}{a.name[1]}</div>
                    <div>
                      <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "600" }}>{a.name}</div>
                      <div style={{ color: "#6b7280", fontSize: "11px" }}>{a.role}</div>
                    </div>
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "12px" }}>{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }}>
            <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Estatisticas</h3>
            {[
              { label: "Conversas", value: "1" },
              { label: "Temperatura IA", value: "0.7" },
              { label: "Modelo", value: "GPT-4" },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ color: "#6b7280", fontSize: "11px" }}>{s.label}</div>
                <div style={{ color: "#fff", fontSize: "16px", fontWeight: "700" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", display: "flex", flexDirection: "column" }}>
          {/* Chat Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: agent.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: "700" }}>{agent.name[0]}</div>
              <div>
                <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{agent.name}</div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>{agent.role}</div>
              </div>
            </div>
            <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "8px" }}>✦</span> Online
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {displayMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: agent.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{msg.from[0]}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "600" }}>{msg.from}</span>
                    <span style={{ color: "#52525b", fontSize: "11px" }}>{msg.time}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 16px", color: "#d4d4d8", fontSize: "14px", lineHeight: "1.5", maxWidth: "80%" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Converse com ${agent.name}...`}
                style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
              />
              <button style={{ width: "42px", height: "42px", borderRadius: "10px", background: agent.color, border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {quickActions.map((a, i) => (
                <button key={i} style={{ padding: "6px 14px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
                  {i === 0 ? "🧠" : i === 1 ? "💡" : "✨"} {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
