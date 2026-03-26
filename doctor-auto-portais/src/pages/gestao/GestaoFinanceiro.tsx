import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

export default function GestaoFinanceiro() {
  const [stats, setStats] = useState({ faturamentoMes: 0, faturamentoAnterior: 0, ticketMedio: 0, osEntregues: 0, totalOS: 0, canceladas: 0 })
  const [osPorMes, setOsPorMes] = useState<{ mes: string; valor: number; qtd: number }[]>([])
  const [topClientes, setTopClientes] = useState<{ nome: string; total: number; qtd: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchFinanceiro() }, [])

  const fetchFinanceiro = async () => {
    try {
      const agora = new Date()
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString()
      const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1).toISOString()
      const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59).toISOString()

      const [fatAtual, fatAnterior, todas] = await Promise.all([
        supabase.from("ordens_servico").select("valor_final")
          .eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMes),
        supabase.from("ordens_servico").select("valor_final")
          .eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMesAnterior).lte("data_entrega", fimMesAnterior),
        supabase.from("ordens_servico").select("valor_final, status, data_entrega, id_cliente, cliente:id_cliente(nome)")
          .eq("id_companies", EMPRESA_ID).eq("status", "entregue").order("data_entrega", { ascending: false }).limit(500),
      ])

      const faturamentoMes = fatAtual.data?.reduce((a: number, o: any) => a + (o.valor_final || 0), 0) || 0
      const faturamentoAnterior = fatAnterior.data?.reduce((a: number, o: any) => a + (o.valor_final || 0), 0) || 0
      const osEntregues = fatAtual.data?.length || 0
      const ticketMedio = osEntregues > 0 ? faturamentoMes / osEntregues : 0

      setStats({ faturamentoMes, faturamentoAnterior, ticketMedio, osEntregues, totalOS: todas.data?.length || 0, canceladas: 0 })

      // Agrupar por mes (ultimos 6 meses)
      const porMes: Record<string, { valor: number; qtd: number }> = {}
      todas.data?.forEach((os: any) => {
        if (!os.data_entrega) return
        const d = new Date(os.data_entrega)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        if (!porMes[key]) porMes[key] = { valor: 0, qtd: 0 }
        porMes[key].valor += os.valor_final || 0
        porMes[key].qtd += 1
      })
      const meses = Object.entries(porMes).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([mes, v]) => ({ mes, ...v }))
      setOsPorMes(meses)

      // Top clientes
      const porCliente: Record<string, { nome: string; total: number; qtd: number }> = {}
      todas.data?.forEach((os: any) => {
        const nome = (os.cliente as any)?.nome || "Desconhecido"
        const id = os.id_cliente
        if (!porCliente[id]) porCliente[id] = { nome, total: 0, qtd: 0 }
        porCliente[id].total += os.valor_final || 0
        porCliente[id].qtd += 1
      })
      setTopClientes(Object.values(porCliente).sort((a, b) => b.total - a.total).slice(0, 8))
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const variacao = stats.faturamentoAnterior > 0
    ? ((stats.faturamentoMes - stats.faturamentoAnterior) / stats.faturamentoAnterior * 100).toFixed(1)
    : "—"
  const varPositiva = Number(variacao) >= 0

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }
  const maxValor = Math.max(...osPorMes.map(m => m.valor), 1)

  const kpis = [
    { label: "Faturamento Mes", value: `R$ ${(stats.faturamentoMes / 1000).toFixed(1)}k`, icon: "💰", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
    { label: "Mes Anterior", value: `R$ ${(stats.faturamentoAnterior / 1000).toFixed(1)}k`, icon: "📊", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    { label: "Variacao", value: variacao === "—" ? "—" : `${varPositiva ? "+" : ""}${variacao}%`, icon: varPositiva ? "📈" : "📉", color: varPositiva ? "#22c55e" : "#f87171", bg: varPositiva ? "rgba(34,197,94,0.08)" : "rgba(248,113,113,0.08)", border: varPositiva ? "rgba(34,197,94,0.2)" : "rgba(248,113,113,0.2)" },
    { label: "Ticket Medio", value: `R$ ${stats.ticketMedio.toFixed(0)}`, icon: "🎯", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  ]

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Financeiro</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Receita, faturamento e indicadores financeiros</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: "14px", padding: "18px 20px" }}>
            <span style={{ fontSize: "20px" }}>{k.icon}</span>
            <div style={{ fontSize: "22px", fontWeight: "700", color: loading ? "#52525b" : k.color, marginTop: "8px" }}>{loading ? "..." : k.value}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Grafico barras */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>Faturamento por Mes</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px" }}>
            {osPorMes.map((m, i) => {
              const pct = (m.valor / maxValor) * 100
              const mesLabel = new Date(m.mes + "-15").toLocaleDateString("pt-BR", { month: "short" })
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#71717a", fontSize: "10px" }}>R${(m.valor / 1000).toFixed(0)}k</span>
                  <div style={{ width: "100%", height: `${Math.max(pct, 4)}%`, background: "linear-gradient(180deg, #7c3aed, #4c1d95)", borderRadius: "6px 6px 0 0", minHeight: "4px", transition: "height 0.5s" }} />
                  <span style={{ color: "#52525b", fontSize: "10px", textTransform: "capitalize" }}>{mesLabel}</span>
                </div>
              )
            })}
            {osPorMes.length === 0 && !loading && <div style={{ flex: 1, textAlign: "center", color: "#52525b", fontSize: "13px", alignSelf: "center" }}>Sem dados</div>}
          </div>
        </div>

        {/* Top clientes */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>Top Clientes por Receita</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {topClientes.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: i < topClientes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", width: "20px" }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{c.nome}</div>
                  <div style={{ color: "#52525b", fontSize: "11px" }}>{c.qtd} OS</div>
                </div>
                <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "700" }}>R$ {c.total.toFixed(0)}</span>
              </div>
            ))}
            {topClientes.length === 0 && !loading && <div style={{ color: "#52525b", fontSize: "13px", textAlign: "center", padding: "20px" }}>Sem dados</div>}
          </div>
        </div>
      </div>

      {/* OS entregues no mes */}
      <div style={{ ...card }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>Resumo do Mes</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "16px" }}>
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
            <div style={{ color: "#22c55e", fontSize: "28px", fontWeight: "700" }}>{loading ? "..." : stats.osEntregues}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>OS Entregues</div>
          </div>
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
            <div style={{ color: "#a78bfa", fontSize: "28px", fontWeight: "700" }}>{loading ? "..." : `R$ ${stats.ticketMedio.toFixed(0)}`}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Ticket Medio</div>
          </div>
          <div style={{ textAlign: "center", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
            <div style={{ color: "#60a5fa", fontSize: "28px", fontWeight: "700" }}>{loading ? "..." : `R$ ${(stats.faturamentoMes).toFixed(0)}`}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>Receita Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
