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

      {/* ── TABELA DE LEADS CLASSIFICADOS (MOTOR IA RAG) ──────────────────── */}
      <div style={{ ...cardStyle, marginBottom: "24px", padding: 0, overflow: "hidden", border: "1px solid rgba(139,92,246,0.3)" }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(90deg, rgba(139,92,246,0.1), transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🎯</span>
            <div>
              <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>Leads Classificados (Inteligencia Artificial)</h3>
              <p style={{ color: "#a1a1aa", fontSize: "11px", marginTop: "2px" }}>Oportunidades mapeadas pelo RAG baseadas no historico de OS e Manuais</p>
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#a78bfa", background: "rgba(139,92,246,0.15)", padding: "4px 10px", borderRadius: "99px", fontWeight: "600" }}>
            Atualizado agora
          </span>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", color: "#a1a1aa", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Cliente</th>
                <th style={{ padding: "12px 20px", textAlign: "left", color: "#a1a1aa", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Oportunidade Mapeada</th>
                <th style={{ padding: "12px 20px", textAlign: "left", color: "#a1a1aa", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Ticket Med.</th>
                <th style={{ padding: "12px 20px", textAlign: "center", color: "#a1a1aa", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Termometro</th>
                <th style={{ padding: "12px 20px", textAlign: "right", color: "#a1a1aa", fontWeight: "600", fontSize: "11px", textTransform: "uppercase" }}>Acao Sugerida</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#e4e4e7", fontWeight: "600", marginBottom: "2px" }}>Joao Carlos Silva</div>
                  <div style={{ color: "#71717a", fontSize: "11px" }}>Ultima visita: 11 meses</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#d8b4fe", fontWeight: "600", marginBottom: "2px" }}>Revisao Preditiva (40.000km)</div>
                  <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Correia Dentada + Tensores (Jeep Compass)</div>
                </td>
                <td style={{ padding: "14px 20px", color: "#10b981", fontWeight: "600" }}>R$ 2.450</td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>🔥 Quente</span>
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button style={{ padding: "6px 14px", background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(34,197,94,0.2)"} onMouseLeave={e => e.currentTarget.style.background="rgba(34,197,94,0.1)"}>
                    WhatsApp Automático
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#e4e4e7", fontWeight: "600", marginBottom: "2px" }}>Marcos Nogueira</div>
                  <div style={{ color: "#71717a", fontSize: "11px" }}>Ultima visita: 3 meses</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#e4e4e7", fontWeight: "500", marginBottom: "2px" }}>Retomada de Orcamento</div>
                  <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Suspensao Dianteira (nao aprovou na ultima OS)</div>
                </td>
                <td style={{ padding: "14px 20px", color: "#10b981", fontWeight: "600" }}>R$ 3.120</td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>🟡 Morno</span>
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button style={{ padding: "6px 14px", background: "transparent", color: "#e4e4e7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    Ligar p/ Negociar
                  </button>
                </td>
              </tr>
              <tr style={{ transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#e4e4e7", fontWeight: "600", marginBottom: "2px" }}>Amanda Costa</div>
                  <div style={{ color: "#71717a", fontSize: "11px" }}>Ultima visita: 14 meses</div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ color: "#e4e4e7", fontWeight: "500", marginBottom: "2px" }}>Troca de Oleo (Vencido)</div>
                  <div style={{ color: "#a1a1aa", fontSize: "11px" }}>Tempo decorrido sugere quilometragem excedida</div>
                </td>
                <td style={{ padding: "14px 20px", color: "#10b981", fontWeight: "600" }}>R$ 480</td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>❄️ Frio</span>
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  <button style={{ padding: "6px 14px", background: "rgba(139,92,246,0.1)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(139,92,246,0.2)"} onMouseLeave={e => e.currentTarget.style.background="rgba(139,92,246,0.1)"}>
                    Campanha de Recuperação
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
