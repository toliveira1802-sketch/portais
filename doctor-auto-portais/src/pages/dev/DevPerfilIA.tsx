import { useState } from "react"

const agents = [
  {
    name: "Sophia", role: "Gestao & Processos", color: "#7c3aed", model: "GPT-4",
    prompt: `Voce e a Sophia, uma assistente de IA especializada em gestao de processos e melhoria continua para oficinas mecanicas.\n\nSuas responsabilidades:\n- Analisar fluxos de trabalho e identificar gargalos\n- Sugerir otimizacoes de processos\n- Ajudar na definicao de metas e KPIs\n- Propor melhorias na eficiencia operacional\n\nSeu tom de comunicacao e profissional, analitico e orientado a resultados. Sempre baseie suas recomendacoes em dados quando disponiveis.`,
    temp: 0.7, tokens: 500, topP: 0.9, freqPenalty: 0.3, presPenalty: 0.1,
  },
  {
    name: "Simone", role: "Qualidade & Analytics", color: "#3b82f6", model: "GPT-4",
    prompt: "Voce e a Simone, analista de dados e controle de qualidade para oficinas mecanicas.",
    temp: 0.5, tokens: 600, topP: 0.85, freqPenalty: 0.2, presPenalty: 0.1,
  },
  {
    name: "Raena", role: "Lead Scoring & CRM", color: "#10b981", model: "GPT-4",
    prompt: "Voce e a Raena, especialista em vendas e relacionamento com clientes para oficinas mecanicas.",
    temp: 0.8, tokens: 450, topP: 0.95, freqPenalty: 0.1, presPenalty: 0.2,
  },
]

export default function DevPerfilIA() {
  const [tab, setTab] = useState(0)
  const agent = agents[tab]

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "24px",
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎭</span> Configuracao dos Perfis IA
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Ajuste system prompts, temperatura e parametros dos agentes</p>
        </div>
        <span style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          ✦ GPT-4
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
        {agents.map((a, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
            cursor: "pointer", fontFamily: "inherit",
            background: tab === i ? "rgba(255,255,255,0.1)" : "transparent",
            border: "none", color: tab === i ? "#fff" : "#6b7280"
          }}>{a.name}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        {/* Prompt */}
        <div style={card}>
          <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>System Prompt</h3>
          <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "16px" }}>Defina a personalidade e comportamento de {agent.name}</p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Prompt do Sistema</label>
            <textarea
              defaultValue={agent.prompt}
              style={{
                width: "100%", minHeight: "200px", padding: "16px", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7",
                fontSize: "13px", fontFamily: "monospace", lineHeight: "1.6", resize: "vertical", outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ flex: 1, padding: "12px", background: "#10b981", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              💾 Salvar Prompt
            </button>
            <button style={{ padding: "12px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", fontSize: "14px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
              🔄 Resetar
            </button>
            <button style={{ padding: "12px 20px", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", color: "#a78bfa", fontSize: "14px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
              ✨ Testar
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Params */}
          <div style={card}>
            <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>⚙️ Parametros</h3>
            <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "16px" }}>Ajuste fino do comportamento</p>

            {[
              { label: "Temperatura", value: agent.temp, desc: "Controla a criatividade. 0 = deterministico, 2 = muito criativo", color: "#f59e0b" },
              { label: "Max Tokens", value: agent.tokens, desc: "Tamanho maximo da resposta", color: "#10b981" },
              { label: "Top P", value: agent.topP, desc: "Controla a diversidade de vocabulario", color: "#3b82f6" },
              { label: "Frequency Penalty", value: agent.freqPenalty, desc: "Penaliza repeticao de palavras", color: "#f59e0b" },
              { label: "Presence Penalty", value: agent.presPenalty, desc: "Incentiva novos topicos", color: "#ef4444" },
            ].map((p, i) => (
              <div key={i} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "600" }}>{p.label}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: `${p.color}20`, color: p.color }}>{p.value}</span>
                </div>
                <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginBottom: "4px" }}>
                  <div style={{ width: `${(typeof p.value === "number" && p.value <= 2) ? (p.value / 2) * 100 : (typeof p.value === "number" ? (p.value / 1000) * 100 : 50)}%`, height: "100%", background: p.color, borderRadius: "2px" }} />
                </div>
                <div style={{ color: "#52525b", fontSize: "11px" }}>{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div style={card}>
            <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Informacoes</h3>
            {[
              { label: "Nome", value: agent.name },
              { label: "Role", value: agent.role },
              { label: "Modelo", value: agent.model },
              { label: "Status", value: "Ativo", isTag: true },
            ].map((info, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ color: "#6b7280", fontSize: "11px" }}>{info.label}</div>
                {info.isTag ? (
                  <span style={{ padding: "2px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", background: "rgba(16,185,129,0.1)", color: "#10b981" }}>{info.value}</span>
                ) : (
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{info.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ color: "#e4e4e7", fontSize: "15px", fontWeight: "600", marginBottom: "4px" }}>Preview de Resposta</h3>
        <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "16px" }}>Teste como o agente responderia com as configuracoes atuais</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {agents.map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: `${a.color}20`, color: a.color }}>{a.name}</span>
                <span style={{ color: "#52525b", fontSize: "12px" }}>T={a.temp}</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "13px", fontStyle: "italic" }}>"Com base na analise dos ultimos 30 dias, identifico que..."</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>{a.tokens} tokens</span>
                <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>Top-P {a.topP}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
