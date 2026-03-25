export default function DevIntegracoes() {
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "24px",
  }

  return (
    <div>
      <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ fontSize: "24px" }}>🔗</span> Integracoes
      </h2>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>Conecte o sistema com o Kommo CRM e configure os agentes de IA.</p>

      {/* Kommo CRM */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>⚡</div>
            <div>
              <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600" }}>Kommo CRM</h3>
              <p style={{ color: "#6b7280", fontSize: "12px" }}>doctorautobosch.kommo.com</p>
            </div>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "rgba(239,68,68,0.1)", color: "#ef4444", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }} /> Desconectado
          </span>
        </div>

        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "16px" }}>
          Conecte o Kommo para sincronizar leads, disparar mensagens via WhatsApp e ativar os agentes de IA de atendimento e reativacao.
        </p>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>⚠️</span>
          <div>
            <div style={{ color: "#fcd34d", fontSize: "13px", fontWeight: "600" }}>Autorizacao necessaria</div>
            <div style={{ color: "#9ca3af", fontSize: "12px" }}>Clique em "Conectar Kommo" e autorize o acesso na janela que abrir.</div>
          </div>
        </div>

        <button style={{ padding: "12px 24px", background: "#ef4444", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px" }}>
          🔗 Conectar Kommo
        </button>
      </div>

      {/* Agentes de IA */}
      <div style={{ ...card, marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🤖</div>
          <div>
            <h3 style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600" }}>Agentes de IA</h3>
            <p style={{ color: "#6b7280", fontSize: "12px" }}>Automacao de atendimento e reativacao via Kommo + WhatsApp</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          {[
            {
              icon: "💬", title: "Agente de Atendimento",
              desc: "Responde leads novos no WhatsApp, coleta nome, placa e sintoma, classifica o servico e detecta temperatura do lead.",
              tags: ["Qualificacao", "Triagem tecnica", "Pre agendamento", "Handoff consultor"],
              active: false
            },
            {
              icon: "🔄", title: "Agente de Reativacao",
              desc: "Varre clientes inativos ha 90+ dias e leads que nao fecharam. Envia mensagem personalizada no WhatsApp.",
              tags: ["Clientes inativos 90d+", "Leads esfriados", "Mensagem personalizada", "Roda as 5h"],
              active: false
            },
            {
              icon: "📥", title: "Sincronizacao de Leads",
              desc: "Importa leads do Kommo para o sistema, classifica por temperatura e cria agendamentos automaticamente.",
              tags: ["Importacao automatica", "Temperatura do lead", "Criacao de agendamento"],
              active: false,
              comingSoon: true
            },
          ].map((agent, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                  <span style={{ fontSize: "20px" }}>{agent.icon}</span>
                  <div>
                    <h4 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>{agent.title}</h4>
                    <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.5", maxWidth: "500px" }}>{agent.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                      {agent.tags.map((tag, j) => (
                        <span key={j} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", background: agent.comingSoon ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: agent.comingSoon ? "#f59e0b" : "#10b981" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "500", background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>
                  {agent.comingSoon ? "Em breve" : "Inativo"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "12px 16px", color: "#52525b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>ℹ️</span> Conecte o Kommo acima para ativar os agentes de IA.
        </div>
      </div>
    </div>
  )
}
