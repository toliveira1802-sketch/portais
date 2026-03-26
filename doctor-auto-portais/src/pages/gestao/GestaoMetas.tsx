import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

type Meta = { label: string; atual: number; meta: number; unidade: string; icon: string; cor: string }

export default function GestaoMetas() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMetas() }, [])

  const fetchMetas = async () => {
    try {
      const agora = new Date()
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString()

      const [fatRes, osRes, cliRes, osTotal] = await Promise.all([
        supabase.from("ordens_servico").select("valor_final").eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMes),
        supabase.from("ordens_servico").select("id_os", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMes),
        supabase.from("clientes").select("id_cliente", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).gte("created_at", inicioMes),
        supabase.from("ordens_servico").select("id_os", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).gte("created_at", inicioMes),
      ])

      const faturamento = fatRes.data?.reduce((a: number, o: any) => a + (o.valor_final || 0), 0) || 0
      const entregues = osRes.count || 0
      const clientes = cliRes.count || 0
      const totalMes = osTotal.count || 0
      const ticketMedio = entregues > 0 ? faturamento / entregues : 0

      setMetas([
        { label: "Faturamento Mensal", atual: faturamento, meta: 50000, unidade: "R$", icon: "💰", cor: "#22c55e" },
        { label: "OS Finalizadas", atual: entregues, meta: 40, unidade: "", icon: "🔧", cor: "#60a5fa" },
        { label: "Novos Clientes", atual: clientes, meta: 15, unidade: "", icon: "👥", cor: "#a78bfa" },
        { label: "Ticket Medio", atual: ticketMedio, meta: 1200, unidade: "R$", icon: "📈", cor: "#fb923c" },
        { label: "Total OS no Mes", atual: totalMes, meta: 60, unidade: "", icon: "📋", cor: "#38bdf8" },
        { label: "Taxa Conversao", atual: totalMes > 0 ? (entregues / totalMes) * 100 : 0, meta: 80, unidade: "%", icon: "🎯", cor: "#f472b6" },
      ])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  const formatVal = (val: number, unidade: string) => {
    if (unidade === "R$") return `R$ ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}`
    if (unidade === "%") return `${val.toFixed(1)}%`
    return String(Math.round(val))
  }

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Metas</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Acompanhamento de metas mensais</p>
      </div>

      {/* Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {loading ? (
          <div style={{ ...card, gridColumn: "span 3", textAlign: "center", color: "#52525b", padding: "40px" }}>Carregando...</div>
        ) : metas.map((m, i) => {
          const pct = Math.min((m.atual / m.meta) * 100, 100)
          const atingiu = pct >= 100
          return (
            <div key={i} style={{ ...card }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>{m.icon}</span>
                  <span style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "13px" }}>{m.label}</span>
                </div>
                {atingiu && <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "2px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: "700" }}>ATINGIDA</span>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <span style={{ fontSize: "26px", fontWeight: "700", color: m.cor }}>{formatVal(m.atual, m.unidade)}</span>
                <span style={{ color: "#52525b", fontSize: "12px" }}>Meta: {formatVal(m.meta, m.unidade)}</span>
              </div>

              {/* Barra de progresso */}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: atingiu ? "#22c55e" : m.cor, borderRadius: "6px", transition: "width 0.8s ease" }} />
              </div>
              <div style={{ textAlign: "right", marginTop: "6px" }}>
                <span style={{ color: pct >= 100 ? "#22c55e" : pct >= 70 ? "#fbbf24" : "#f87171", fontSize: "12px", fontWeight: "700" }}>{pct.toFixed(0)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dica */}
      <div style={{ ...card, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <div>
            <div style={{ color: "#a78bfa", fontWeight: "600", fontSize: "13px" }}>Dica</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>As metas sao atualizadas em tempo real. Edite os valores-alvo diretamente no Supabase para ajustar conforme a estrategia.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
