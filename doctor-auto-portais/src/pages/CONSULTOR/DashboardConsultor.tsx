import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getDashboardStats } from "../lib/supabase"
import { useIsMobile } from "../lib/useIsMobile"

const COR = "#1d4ed8"

export default function DashboardConsultor({ onNavigate }: { onNavigate: (k: string) => void }) {
  const { consultor } = useAuth()
  const isMobile = useIsMobile()
  const [stats, setStats] = useState({ osAbertas: 0, osHoje: 0, clientesNoMes: 0, faturamentoMes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (consultor?.empresa_id) {
      getDashboardStats(consultor.empresa_id).then(s => { setStats(s); setLoading(false) }).catch(() => setLoading(false))
    }
  }, [consultor])

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "18px 20px",
  }

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "14px", marginBottom: "24px" }}>
        {[
          { icon: "🚗", label: "Veiculos no Patio", valor: loading ? "..." : stats.osAbertas, cor: "29,78,216" },
          { icon: "📅", label: "Agendamentos Hoje", valor: loading ? "..." : stats.osHoje, cor: "29,78,216" },
          { icon: "💰", label: "Faturamento (Mes)", valor: loading ? "..." : `R$ ${(stats.faturamentoMes / 1000).toFixed(0)}k`, cor: "245,158,11" },
          { icon: "🔧", label: "Entregas no Mes", valor: loading ? "..." : stats.clientesNoMes, cor: "16,185,129" },
        ].map((kpi, i) => (
          <div key={i} style={{ ...cardStyle, background: `linear-gradient(135deg, rgba(${kpi.cor},0.12), rgba(0,0,0,0))` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "6px" }}>{kpi.label}</div>
                <div style={{ color: "#fff", fontSize: "26px", fontWeight: "700" }}>{kpi.valor}</div>
              </div>
              <span style={{ fontSize: "20px", opacity: 0.6 }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pendencias do dia */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COR }} />
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>Pendencias do dia</span>
          </div>
          <button onClick={() => onNavigate("ordens")} style={{ background: "transparent", border: "none", color: "#6b7280", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
            Ver todas &gt;
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.15)" }}>
          <span style={{ color: "#10b981", fontSize: "16px" }}>✓</span>
          <span style={{ color: "#d4d4d8", fontSize: "13px" }}>Nenhuma pendencia para hoje. Bom trabalho!</span>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "14px" }}>
        {[
          { icon: "🔧", label: "Operacional", sub: "Patio e OS em andamento", key: "patio", bg: "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(29,78,216,0.05))", bor: "rgba(29,78,216,0.3)" },
          { icon: "💰", label: "Financeiro", sub: "Faturamento e metas", key: "financeiro", bg: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))", bor: "rgba(16,185,129,0.3)" },
          { icon: "📈", label: "Produtividade", sub: "Ranking e performance", key: "produtividade", bg: "rgba(255,255,255,0.03)", bor: "rgba(255,255,255,0.08)" },
          { icon: "📅", label: "Agenda do Dia", sub: "Grade horaria dos mecanicos", key: "agendamentos", bg: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))", bor: "rgba(245,158,11,0.25)" },
        ].map((card, i) => (
          <button key={i} onClick={() => onNavigate(card.key)} style={{
            background: card.bg, border: `1px solid ${card.bor}`,
            borderRadius: "14px", padding: "20px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s", fontFamily: "inherit", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "110px"
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
          >
            <span style={{ fontSize: "24px", marginBottom: "12px" }}>{card.icon}</span>
            <div>
              <div style={{ color: "#f4f4f5", fontWeight: "600", fontSize: "14px" }}>{card.label}</div>
              <div style={{ color: "#71717a", fontSize: "11px", marginTop: "2px" }}>{card.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
