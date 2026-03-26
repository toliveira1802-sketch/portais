import { useState } from "react"

type Sistema = { nome: string; status: "online" | "offline" | "manutencao"; versao: string; desc: string; icon: string }

const SISTEMAS: Sistema[] = [
  { nome: "Portal Consultor", status: "online", versao: "1.0.0", desc: "Atendimento, OS e clientes", icon: "💼" },
  { nome: "Portal Gestao", status: "online", versao: "1.0.0", desc: "Dashboard gerencial e KPIs", icon: "📊" },
  { nome: "Portal Mecanico", status: "online", versao: "1.0.0", desc: "OS e checklist dos mecanicos", icon: "🔧" },
  { nome: "Portal Cliente", status: "online", versao: "1.0.0", desc: "Acompanhamento pelo cliente", icon: "👤" },
  { nome: "Portal Dev", status: "online", versao: "1.0.0", desc: "Ferramentas de desenvolvimento", icon: "💻" },
  { nome: "Supabase (DB)", status: "online", versao: "v2", desc: "Banco de dados e autenticacao", icon: "🗄️" },
]

const INTEG = [
  { nome: "WhatsApp API", status: "planejado", desc: "Notificacoes automaticas para clientes" },
  { nome: "Gateway Pagamento", status: "planejado", desc: "Pagamento online de OS" },
  { nome: "NF-e / Nota Fiscal", status: "planejado", desc: "Emissao automatica de notas" },
  { nome: "Google Calendar", status: "planejado", desc: "Sincronizar agendamentos" },
]

export default function GestaoTecnologia() {
  const [sistemas] = useState(SISTEMAS)

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  const STATUS_COR = {
    online: { label: "Online", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    offline: { label: "Offline", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    manutencao: { label: "Manutencao", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  }

  const online = sistemas.filter(s => s.status === "online").length

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Tecnologia</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Status dos sistemas e integracoes</p>
      </div>

      {/* Status geral */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {[
          { label: "Sistemas Online", value: `${online}/${sistemas.length}`, icon: "🟢", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
          { label: "Stack", value: "React + Vite", icon: "⚛️", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
          { label: "Database", value: "Supabase", icon: "🗄️", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
        ].map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: "14px", padding: "18px 20px" }}>
            <span style={{ fontSize: "20px" }}>{k.icon}</span>
            <div style={{ fontSize: "22px", fontWeight: "700", color: k.color, marginTop: "8px" }}>{k.value}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Sistemas */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px" }}>Sistemas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sistemas.map((s, i) => {
              const st = STATUS_COR[s.status]
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: "18px" }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{s.nome}</div>
                    <div style={{ color: "#52525b", fontSize: "11px" }}>{s.desc}</div>
                  </div>
                  <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: "700" }}>{st.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Integracoes planejadas */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px" }}>Integracoes Planejadas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {INTEG.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#52525b", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{item.nome}</div>
                  <div style={{ color: "#52525b", fontSize: "11px" }}>{item.desc}</div>
                </div>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "#52525b", padding: "3px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: "700" }}>PLANEJADO</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stack tecnica */}
      <div style={{ ...card }}>
        <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px" }}>Stack Tecnica</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["React 19", "TypeScript 5.9", "Vite 8", "Supabase", "React Router 7", "Vercel"].map(t => (
            <span key={t} style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
