import { useState } from "react"

type Melhoria = { id: number; titulo: string; desc: string; area: string; impacto: "alto" | "medio" | "baixo"; status: "pendente" | "em_analise" | "aprovada" | "implementada" }

const MELHORIAS_INICIAIS: Melhoria[] = [
  { id: 1, titulo: "Checklist digital de entrada", desc: "Substituir checklist em papel por formulario digital com fotos do veiculo na recepcao", area: "Operacional", impacto: "alto", status: "em_analise" },
  { id: 2, titulo: "Notificacao WhatsApp automatica", desc: "Enviar status da OS automaticamente ao cliente quando mudar de etapa", area: "Atendimento", impacto: "alto", status: "pendente" },
  { id: 3, titulo: "Dashboard TV no patio", desc: "Tela com status em tempo real das OS para os mecanicos acompanharem", area: "Tecnologia", impacto: "medio", status: "aprovada" },
  { id: 4, titulo: "Controle de pecas por OS", desc: "Vincular pecas utilizadas diretamente a cada ordem de servico", area: "Estoque", impacto: "alto", status: "pendente" },
  { id: 5, titulo: "Pesquisa de satisfacao pos-entrega", desc: "Enviar link de avaliacao NPS apos entrega do veiculo", area: "Atendimento", impacto: "medio", status: "implementada" },
  { id: 6, titulo: "Agenda mecanico otimizada", desc: "Algoritmo para distribuir OS entre mecanicos baseado em especialidade e carga", area: "Operacional", impacto: "medio", status: "pendente" },
]

const IMPACTO_MAP = {
  alto: { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  medio: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  baixo: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
}

const STATUS_MAP = {
  pendente: { label: "Pendente", color: "#71717a", bg: "rgba(255,255,255,0.05)" },
  em_analise: { label: "Em Analise", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  aprovada: { label: "Aprovada", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  implementada: { label: "Implementada", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
}

export default function GestaoMelhorias() {
  const [melhorias] = useState<Melhoria[]>(MELHORIAS_INICIAIS)
  const [filtro, setFiltro] = useState("todos")

  const filtradas = filtro === "todos" ? melhorias : melhorias.filter(m => m.status === filtro)

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Melhorias</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Sugestoes e melhorias para a oficina</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>
            {melhorias.filter(m => m.status === "implementada").length} implementadas
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[{ k: "todos", label: "Todos" }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ k, label: v.label }))].map(f => (
          <button key={f.k} onClick={() => setFiltro(f.k)} style={{
            padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
            background: filtro === f.k ? "#7c3aed" : "rgba(255,255,255,0.05)", color: filtro === f.k ? "#fff" : "#71717a", border: "none"
          }}>{f.label}</button>
        ))}
      </div>

      {/* Cards de melhorias */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {filtradas.map(m => {
          const imp = IMPACTO_MAP[m.impacto]
          const st = STATUS_MAP[m.status]
          return (
            <div key={m.id} style={{ ...card }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", flex: 1 }}>{m.titulo}</h3>
                <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: "99px", fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap", marginLeft: "8px" }}>{st.label}</span>
              </div>
              <p style={{ color: "#71717a", fontSize: "12px", lineHeight: "1.5", marginBottom: "14px" }}>{m.desc}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "#71717a", padding: "3px 8px", borderRadius: "6px", fontSize: "11px" }}>{m.area}</span>
                <span style={{ background: imp.bg, color: imp.color, padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>Impacto {m.impacto}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
