import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COR = "#0891b2"

interface Props {
  user: any
  onNavigate: (k: string) => void
}

export default function ColaboradorDashboard({ user, onNavigate }: Props) {
  const [stats, setStats] = useState({ osAtribuidas: 0, osFinalizadas: 0, horasMes: 0, pontoHoje: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const hoje = new Date().toISOString().split("T")[0]
        const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

        const [atribuidas, finalizadas, pontoHoje] = await Promise.all([
          supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
            .eq("id_mecanico", user.id).in("status", ["aberta", "em_andamento"]),
          supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
            .eq("id_mecanico", user.id).eq("status", "entregue").gte("data_entrega", inicioMes),
          supabase.from("registro_ponto").select("id")
            .eq("colaborador_id", user.id).gte("data_registro", hoje).limit(1),
        ])

        setStats({
          osAtribuidas: atribuidas.count || 0,
          osFinalizadas: finalizadas.count || 0,
          horasMes: 0,
          pontoHoje: (pontoHoje.data?.length || 0) > 0,
        })
      } catch {
        // tabelas podem nao existir ainda
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "18px 20px",
  }

  const nome = user?.nome?.split(" ").slice(0, 2).join(" ") || "Colaborador"
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"

  return (
    <div>
      {/* Saudacao */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: 0 }}>
          {saudacao}, {nome}! 👋
        </h2>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Ponto rapido */}
      <div style={{
        ...cardStyle,
        marginBottom: "24px",
        background: stats.pontoHoje
          ? "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(0,0,0,0))"
          : "linear-gradient(135deg, rgba(234,179,8,0.1), rgba(0,0,0,0))",
        borderColor: stats.pontoHoje ? "rgba(34,197,94,0.2)" : "rgba(234,179,8,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>{stats.pontoHoje ? "✅" : "⏰"}</span>
          <div>
            <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
              {stats.pontoHoje ? "Ponto registrado hoje" : "Voce ainda nao bateu o ponto"}
            </div>
            <div style={{ color: "#71717a", fontSize: "12px" }}>
              {stats.pontoHoje ? "Tudo certo por aqui" : "Registre sua entrada agora"}
            </div>
          </div>
        </div>
        {!stats.pontoHoje && (
          <button onClick={() => onNavigate("colab-ponto")} style={{
            padding: "10px 20px", background: COR, border: "none", borderRadius: "10px",
            color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
          }}>
            Bater Ponto
          </button>
        )}
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { icon: "📋", label: "OS Atribuidas", valor: loading ? "..." : stats.osAtribuidas, cor: "8,145,178" },
          { icon: "✅", label: "Finalizadas (Mes)", valor: loading ? "..." : stats.osFinalizadas, cor: "34,197,94" },
          { icon: "🕐", label: "Horas (Mes)", valor: loading ? "..." : `${stats.horasMes}h`, cor: "168,85,247" },
          { icon: "⭐", label: "Avaliacao Media", valor: "—", cor: "234,179,8" },
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

      {/* Acesso rapido */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
        {[
          { icon: "⏰", label: "Meu Ponto", sub: "Registrar entrada/saida", key: "colab-ponto", bg: `linear-gradient(135deg, rgba(8,145,178,0.15), rgba(8,145,178,0.05))`, bor: "rgba(8,145,178,0.3)" },
          { icon: "📋", label: "Minhas OS", sub: "Ordens atribuidas", key: "colab-os", bg: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", bor: "rgba(59,130,246,0.3)" },
          { icon: "💰", label: "Holerite", sub: "Pagamentos e recibos", key: "colab-holerite", bg: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", bor: "rgba(34,197,94,0.3)" },
          { icon: "📢", label: "Comunicados", sub: "Avisos da empresa", key: "colab-comunicados", bg: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))", bor: "rgba(234,179,8,0.3)" },
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
