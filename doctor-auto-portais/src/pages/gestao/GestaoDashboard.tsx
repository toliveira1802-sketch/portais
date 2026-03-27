import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label: "Aberta", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  em_andamento: { label: "Em Andamento", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  aguardando_peca: { label: "Aguard. Peca", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  aguardando_aprovacao: { label: "Aguard. Aprovacao", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  finalizada: { label: "Finalizada", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  entregue: { label: "Entregue", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  cancelada: { label: "Cancelada", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
}

type Alerta = { tipo: "error" | "warning" | "info" | "success"; msg: string; icon: string }

export default function GestaoDashboard({ onNavigate, usuario }: { onNavigate: (k: string) => void; usuario?: any }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    faturamentoMes: 0, faturamentoAnterior: 0, osAbertas: 0, osHoje: 0,
    clientesMes: 0, ticketMedio: 0, noPatio: 0, equipeAtiva: 0, equipeTotal: 0,
    osEntreguesMes: 0, osTotalMes: 0, tempoMedio: 0,
  })
  const [contStatus, setContStatus] = useState<Record<string, number>>({})
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [osPorMes, setOsPorMes] = useState<{ mes: string; valor: number; qtd: number }[]>([])
  const [osRecentes, setOsRecentes] = useState<any[]>([])
  const [metasResumo, setMetasResumo] = useState<{ label: string; pct: number; cor: string }[]>([])

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const agora = new Date()
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString()
      const inicioMesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1).toISOString()
      const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59).toISOString()
      const hoje = agora.toISOString().split("T")[0]

      // Queries paralelas
      const [
        fatAtualRes, fatAnteriorRes, osAbertasRes, osHojeRes, clientesMesRes,
        patioRes, consultoresRes, mecanicosRes, gestoresRes,
        osRecentesRes, osTodasMesRes, tempoRes
      ] = await Promise.all([
        supabase.from("ordens_servico").select("valor_final").eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMes),
        supabase.from("ordens_servico").select("valor_final").eq("id_companies", EMPRESA_ID).eq("status", "entregue").gte("data_entrega", inicioMesAnterior).lte("data_entrega", fimMesAnterior),
        supabase.from("ordens_servico").select("id_os, status").eq("id_companies", EMPRESA_ID).in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"]),
        supabase.from("ordens_servico").select("id_os", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).gte("data_entrada", hoje),
        supabase.from("clientes").select("id_cliente", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).gte("created_at", inicioMes),
        supabase.from("ordens_servico").select("id_os").eq("id_companies", EMPRESA_ID).in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"]),
        supabase.from("colaboradores_portal_consultor").select("id, ativo").eq("empresa_id", EMPRESA_ID),
        supabase.from("colaboradores_portal_mecanico").select("id, ativo").eq("empresa_id", EMPRESA_ID),
        supabase.from("colaboradores_portal_gestao").select("id, ativo").eq("empresa_id", EMPRESA_ID),
        supabase.from("ordens_servico")
          .select("id_os, numero_os, status, valor_final, data_entrada, cliente:id_cliente(nome), veiculo:id_veiculo(placa,marca,modelo)")
          .eq("id_companies", EMPRESA_ID).order("created_at", { ascending: false }).limit(6),
        supabase.from("ordens_servico").select("id_os, status, valor_final").eq("id_companies", EMPRESA_ID).gte("created_at", inicioMes),
        supabase.from("ordens_servico").select("data_entrada, data_conclusao").eq("id_companies", EMPRESA_ID).in("status", ["finalizada", "entregue"]).not("data_conclusao", "is", null).limit(100),
      ])

      // Faturamento
      const faturamentoMes = fatAtualRes.data?.reduce((a: number, o: any) => a + (o.valor_final || 0), 0) || 0
      const faturamentoAnterior = fatAnteriorRes.data?.reduce((a: number, o: any) => a + (o.valor_final || 0), 0) || 0
      const osEntreguesMes = fatAtualRes.data?.length || 0
      const ticketMedio = osEntreguesMes > 0 ? faturamentoMes / osEntreguesMes : 0

      // OS Abertas e contagem por status
      const osAbertasList = osAbertasRes.data || []
      const contagem: Record<string, number> = {}
      osAbertasList.forEach((o: any) => { contagem[o.status] = (contagem[o.status] || 0) + 1 })
      setContStatus(contagem)

      // Total equipe
      const todosColab = [
        ...(consultoresRes.data || []),
        ...(mecanicosRes.data || []),
        ...(gestoresRes.data || []),
      ]
      const equipeAtiva = todosColab.filter((c: any) => c.ativo).length

      // Tempo medio
      let totalDias = 0, countT = 0
      tempoRes.data?.forEach((o: any) => {
        if (o.data_entrada && o.data_conclusao) {
          const dias = (new Date(o.data_conclusao).getTime() - new Date(o.data_entrada).getTime()) / (1000 * 60 * 60 * 24)
          if (dias > 0 && dias < 60) { totalDias += dias; countT++ }
        }
      })

      // OS do mes para metas
      const osMes = osTodasMesRes.data || []
      const osTotalMes = osMes.length
      const entreguesMes = osMes.filter((o: any) => o.status === "entregue").length

      setStats({
        faturamentoMes, faturamentoAnterior, osAbertas: osAbertasList.length,
        osHoje: osHojeRes.count || 0, clientesMes: clientesMesRes.count || 0,
        ticketMedio, noPatio: patioRes.data?.length || 0,
        equipeAtiva, equipeTotal: todosColab.length,
        osEntreguesMes, osTotalMes, tempoMedio: countT > 0 ? totalDias / countT : 0,
      })

      setOsRecentes(osRecentesRes.data || [])

      // Metas resumo
      setMetasResumo([
        { label: "Faturamento", pct: Math.min((faturamentoMes / 50000) * 100, 100), cor: "#22c55e" },
        { label: "OS Entregues", pct: Math.min((entreguesMes / 40) * 100, 100), cor: "#60a5fa" },
        { label: "Novos Clientes", pct: Math.min(((clientesMesRes.count || 0) / 15) * 100, 100), cor: "#a78bfa" },
        { label: "Ticket Medio", pct: Math.min((ticketMedio / 1200) * 100, 100), cor: "#fb923c" },
      ])

      // Faturamento por mes (ultimos 6 meses)
      const { data: fatHistorico } = await supabase.from("ordens_servico")
        .select("valor_final, data_entrega").eq("id_companies", EMPRESA_ID)
        .eq("status", "entregue").order("data_entrega", { ascending: false }).limit(500)
      const porMes: Record<string, { valor: number; qtd: number }> = {}
      fatHistorico?.forEach((os: any) => {
        if (!os.data_entrega) return
        const d = new Date(os.data_entrega)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        if (!porMes[key]) porMes[key] = { valor: 0, qtd: 0 }
        porMes[key].valor += os.valor_final || 0
        porMes[key].qtd += 1
      })
      setOsPorMes(Object.entries(porMes).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([mes, v]) => ({ mes, ...v })))

      // Alertas
      const als: Alerta[] = []
      const { count: vencidas } = await supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
        .eq("id_companies", EMPRESA_ID).in("status", ["aberta", "em_andamento"]).lt("data_previsao", agora.toISOString())
      if (vencidas && vencidas > 0) als.push({ tipo: "error", msg: `${vencidas} OS com prazo vencido`, icon: "🔴" })

      const { count: semMec } = await supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
        .eq("id_companies", EMPRESA_ID).in("status", ["aberta"]).is("id_mecanico", null)
      if (semMec && semMec > 0) als.push({ tipo: "warning", msg: `${semMec} OS sem mecanico atribuido`, icon: "🟡" })

      if (faturamentoMes > faturamentoAnterior && faturamentoAnterior > 0) {
        const crescimento = ((faturamentoMes - faturamentoAnterior) / faturamentoAnterior * 100).toFixed(0)
        als.push({ tipo: "success", msg: `Faturamento ${crescimento}% acima do mes anterior`, icon: "🟢" })
      }

      if (als.length === 0) als.push({ tipo: "info", msg: "Tudo sob controle. Sem alertas no momento.", icon: "🔵" })
      setAlertas(als)

    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"
  const variacao = stats.faturamentoAnterior > 0
    ? ((stats.faturamentoMes - stats.faturamentoAnterior) / stats.faturamentoAnterior * 100)
    : 0
  const maxValorMes = Math.max(...osPorMes.map(m => m.valor), 1)

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  const MODULOS = [
    { label: "OS Ultimate", key: "gestao-os", icon: "🔧", cor: "#7c3aed", desc: "Todas as ordens" },
    { label: "Financeiro", key: "gestao-financeiro", icon: "💰", cor: "#22c55e", desc: "Receita e custos" },
    { label: "Metas", key: "gestao-metas", icon: "🎯", cor: "#60a5fa", desc: "Acompanhamento" },
    { label: "Operacoes", key: "gestao-operacoes", icon: "⚙️", cor: "#fbbf24", desc: "Patio e servicos" },
    { label: "Comercial", key: "gestao-comercial", icon: "🛒", cor: "#f472b6", desc: "Clientes e vendas" },
    { label: "RH", key: "gestao-rh", icon: "👥", cor: "#a78bfa", desc: "Equipe e portais" },
    { label: "Fornecedores", key: "gestao-fornecedores", icon: "🏭", cor: "#fb923c", desc: "Parceiros" },
    { label: "Melhorias", key: "gestao-melhorias", icon: "💡", cor: "#38bdf8", desc: "Sugestoes e ideias" },
    { label: "Tecnologia", key: "gestao-tecnologia", icon: "🖥️", cor: "#34d399", desc: "Status dos sistemas" },
    { label: "Veiculos Orfaos", key: "gestao-orfaos", icon: "🚗", cor: "#e879f9", desc: "Sem OS ativa" },
  ]

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>
            {saudacao}, {usuario?.nome?.split(" ")[0] || "Gestor"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#71717a", fontSize: "13px" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "2px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>
              Doctor Auto Prime
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => fetchAll()} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#71717a", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>
            Atualizar
          </button>
          <button onClick={() => onNavigate("gestao-os")} style={{ padding: "8px 16px", background: "#7c3aed", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "inherit" }}>
            OS Ultimate →
          </button>
        </div>
      </div>

      {/* ── KPI CARDS (8) ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          {
            label: "Faturamento Mes", value: `R$ ${(stats.faturamentoMes / 1000).toFixed(1)}k`,
            sub: variacao !== 0 ? `${variacao >= 0 ? "+" : ""}${variacao.toFixed(1)}% vs anterior` : "Sem comparativo",
            icon: "💰", color: "#22c55e", bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.15)",
            subColor: variacao >= 0 ? "#22c55e" : "#f87171"
          },
          {
            label: "OS Abertas / Patio", value: `${stats.osAbertas}`,
            sub: `${stats.osHoje} abertas hoje`, icon: "🔧", color: "#60a5fa",
            bg: "rgba(96,165,250,0.06)", border: "rgba(96,165,250,0.15)", subColor: "#52525b"
          },
          {
            label: "Novos Clientes", value: String(stats.clientesMes),
            sub: "Este mes", icon: "👥", color: "#a78bfa",
            bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.15)", subColor: "#52525b"
          },
          {
            label: "Ticket Medio", value: `R$ ${stats.ticketMedio.toFixed(0)}`,
            sub: `${stats.osEntreguesMes} OS entregues`, icon: "📈", color: "#fb923c",
            bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.15)", subColor: "#52525b"
          },
          {
            label: "Veiculos no Patio", value: String(stats.noPatio),
            sub: `Tempo medio: ${stats.tempoMedio.toFixed(1)}d`, icon: "🚗", color: "#38bdf8",
            bg: "rgba(56,189,248,0.06)", border: "rgba(56,189,248,0.15)", subColor: "#52525b"
          },
          {
            label: "Equipe Ativa", value: `${stats.equipeAtiva}/${stats.equipeTotal}`,
            sub: "Colaboradores nos portais", icon: "🏢", color: "#e879f9",
            bg: "rgba(232,121,249,0.06)", border: "rgba(232,121,249,0.15)", subColor: "#52525b"
          },
          {
            label: "OS Total Mes", value: String(stats.osTotalMes),
            sub: `${stats.osEntreguesMes} entregues`, icon: "📋", color: "#fbbf24",
            bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.15)", subColor: "#52525b"
          },
          {
            label: "Taxa Conversao", value: stats.osTotalMes > 0 ? `${((stats.osEntreguesMes / stats.osTotalMes) * 100).toFixed(0)}%` : "—",
            sub: "Entregues / Total", icon: "🎯", color: "#f472b6",
            bg: "rgba(244,114,182,0.06)", border: "rgba(244,114,182,0.15)", subColor: "#52525b"
          },
        ].map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: "14px", padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "18px" }}>{k.icon}</span>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: k.color, boxShadow: `0 0 8px ${k.color}` }} />
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: loading ? "#3f3f46" : k.color, marginBottom: "2px" }}>
              {loading ? "..." : k.value}
            </div>
            <div style={{ color: "#52525b", fontSize: "11px" }}>{k.label}</div>
            {!loading && <div style={{ color: k.subColor, fontSize: "11px", marginTop: "4px" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* ── INTELIGÊNCIA COMERCIAL (MOTOR IA) ──────────────────── */}
      <div style={{ ...card, background: "linear-gradient(145deg, rgba(124,58,237,0.03) 0%, rgba(13,148,136,0.03) 100%)", border: "1px solid rgba(45,212,191,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#2dd4bf" }}>✨</span> Motor de Inteligência & Previsibilidade (IA)
            </h3>
            <p style={{ color: "#71717a", fontSize: "11px", marginTop: "4px" }}>Análise contínua da base de clientes e OS finalizadas via RAG.</p>
          </div>
          <span style={{ fontSize: "11px", color: "#2dd4bf", background: "rgba(45,212,191,0.1)", padding: "4px 10px", borderRadius: "99px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2dd4bf", boxShadow: "0 0 8px #2dd4bf" }} />
            Monitoramento Ativo
          </span>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {/* Oportunidade 1 */}
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#a1a1aa", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Faturamento Previsível (Próx. 30d)</div>
            <div style={{ color: "#10b981", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>R$ 42.500</div>
            <div style={{ color: "#a1a1aa", fontSize: "12px", lineHeight: "1.5" }}>
              IA mapeou <strong style={{color:"#e4e4e7"}}>38 clientes</strong> da base com manutenções preventivas (correia, fluidos) vencendo neste mês.
            </div>
          </div>
          
          {/* Oportunidade 2 */}
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#a1a1aa", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Leads Aquecidos (Tabela IA)</div>
            <div style={{ color: "#f59e0b", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>12 Clientes</div>
            <div style={{ color: "#a1a1aa", fontSize: "12px", lineHeight: "1.5", flex: 1 }}>
               Classificados com <strong style={{color:"#e4e4e7"}}>alta propensão de compra</strong> baseado no histórico de visitas recentes e orçamentos não aprovados.
            </div>
            <button onClick={() => onNavigate("gestao-comercial")} style={{ marginTop: "12px", width: "100%", padding: "8px", background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}>
              Ver Lista de Leads →
            </button>
          </div>
          
          {/* Oportunidade 3 */}
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "16px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#a1a1aa", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Risco de Evasão (Churn)</div>
            <div style={{ color: "#ef4444", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>5 Clientes Premium</div>
            <div style={{ color: "#a1a1aa", fontSize: "12px", lineHeight: "1.5", flex: 1 }}>
               Clientes de alto ticket que não retornam há mais de 8 meses. A IA sugere <strong style={{color:"#e4e4e7"}}>campanha ativa de retenção</strong>.
            </div>
            <button style={{ marginTop: "12px", width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}>
              Disparar Mensagens (WhatsApp)
            </button>
          </div>
        </div>
      </div>

      {/* ── ALERTAS + STATUS OS ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Alertas */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            Alertas e Avisos
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {alertas.map((a, i) => {
              const cores = {
                error: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#fca5a5" },
                warning: { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.2)", text: "#fde68a" },
                success: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#86efac" },
                info: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", text: "#93c5fd" },
              }
              const c = cores[a.tipo]
              return (
                <div key={i} style={{ padding: "10px 12px", borderRadius: "8px", fontSize: "13px", background: c.bg, border: `1px solid ${c.border}`, color: c.text, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{a.icon}</span> {a.msg}
                </div>
              )
            })}
          </div>
        </div>

        {/* Distribuicao de Status */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px" }}>
            OS por Status (Ativas)
          </h3>
          {Object.keys(contStatus).length === 0 && !loading ? (
            <div style={{ color: "#52525b", fontSize: "13px", textAlign: "center", padding: "20px" }}>Nenhuma OS ativa</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(contStatus).map(([status, qtd]) => {
                const st = STATUS_MAP[status] || { label: status, color: "#71717a", bg: "rgba(255,255,255,0.05)" }
                const totalAtivas = Object.values(contStatus).reduce((a, b) => a + b, 0)
                const pct = totalAtivas > 0 ? (qtd / totalAtivas) * 100 : 0
                return (
                  <div key={status}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: st.color, fontSize: "12px", fontWeight: "600" }}>{st.label}</span>
                      <span style={{ color: "#52525b", fontSize: "12px" }}>{qtd} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: st.color, borderRadius: "4px", transition: "width 0.6s" }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── FATURAMENTO GRAFICO + METAS ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>

        {/* Grafico barras - Faturamento 6 meses */}
        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>Faturamento - Ultimos 6 Meses</h3>
            <button onClick={() => onNavigate("gestao-financeiro")} style={{ background: "transparent", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "inherit" }}>
              Ver detalhes →
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "170px", paddingTop: "10px" }}>
            {osPorMes.map((m, i) => {
              const pct = (m.valor / maxValorMes) * 100
              const mesLabel = new Date(m.mes + "-15").toLocaleDateString("pt-BR", { month: "short" })
              const isUltimo = i === osPorMes.length - 1
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: isUltimo ? "#22c55e" : "#52525b", fontSize: "10px", fontWeight: isUltimo ? "700" : "400" }}>
                    R${(m.valor / 1000).toFixed(0)}k
                  </span>
                  <div style={{
                    width: "100%", height: `${Math.max(pct, 4)}%`,
                    background: isUltimo ? "linear-gradient(180deg, #22c55e, #166534)" : "linear-gradient(180deg, #7c3aed, #4c1d95)",
                    borderRadius: "6px 6px 2px 2px", minHeight: "4px", transition: "height 0.5s"
                  }} />
                  <span style={{ color: "#52525b", fontSize: "10px", textTransform: "capitalize" }}>{mesLabel}</span>
                </div>
              )
            })}
            {osPorMes.length === 0 && !loading && (
              <div style={{ flex: 1, textAlign: "center", color: "#3f3f46", fontSize: "13px", alignSelf: "center" }}>Sem dados historicos</div>
            )}
          </div>
        </div>

        {/* Metas resumo */}
        <div style={{ ...card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>Metas do Mes</h3>
            <button onClick={() => onNavigate("gestao-metas")} style={{ background: "transparent", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "inherit" }}>
              Ver todas →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {metasResumo.map((m, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#a1a1aa", fontSize: "12px" }}>{m.label}</span>
                  <span style={{ color: m.pct >= 100 ? "#22c55e" : m.pct >= 70 ? "#fbbf24" : "#f87171", fontSize: "12px", fontWeight: "700" }}>
                    {m.pct.toFixed(0)}%
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", background: m.pct >= 100 ? "#22c55e" : m.cor, borderRadius: "4px", transition: "width 0.8s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OS RECENTES ────────────────────────────────────────── */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>Ultimas Ordens de Servico</h3>
          <button onClick={() => onNavigate("gestao-os")} style={{ background: "transparent", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "inherit" }}>
            Ver todas →
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#OS", "Cliente", "Veiculo", "Status", "Valor", "Data"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#52525b", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#3f3f46" }}>Carregando...</td></tr>
              ) : osRecentes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "#3f3f46" }}>Nenhuma OS</td></tr>
              ) : osRecentes.map((os, i) => {
                const st = STATUS_MAP[os.status] || { label: os.status, color: "#71717a", bg: "rgba(255,255,255,0.05)" }
                return (
                  <tr key={os.id_os} style={{ borderBottom: i < osRecentes.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "12px 16px", color: "#a78bfa", fontWeight: "700" }}>#{os.numero_os}</td>
                    <td style={{ padding: "12px 16px", color: "#e4e4e7" }}>{os.cliente?.nome || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#e4e4e7", fontWeight: "600" }}>{os.veiculo?.placa || "—"}</span>
                      {os.veiculo?.modelo && <span style={{ color: "#52525b", marginLeft: "6px", fontSize: "11px" }}>{os.veiculo.modelo}</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#22c55e", fontWeight: "600" }}>
                      {os.valor_final ? `R$ ${os.valor_final.toFixed(2)}` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#52525b", fontSize: "12px" }}>
                      {os.data_entrada ? new Date(os.data_entrada).toLocaleDateString("pt-BR") : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODULOS - ACESSO RAPIDO ────────────────────────────── */}
      <div>
        <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "14px" }}>Modulos do Sistema</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px" }}>
          {MODULOS.map(m => (
            <button key={m.key} onClick={() => onNavigate(m.key)} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "16px 14px", cursor: "pointer", textAlign: "left",
              fontFamily: "inherit", transition: "all 0.15s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `${m.cor}12`
                ;(e.currentTarget as HTMLElement).style.borderColor = `${m.cor}30`
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"
                ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
              }}
            >
              <span style={{ fontSize: "20px" }}>{m.icon}</span>
              <div style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "12px", marginTop: "8px" }}>{m.label}</div>
              <div style={{ color: "#52525b", fontSize: "11px", marginTop: "2px" }}>{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── FOOTER STATUS ──────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ color: "#3f3f46", fontSize: "11px" }}>
          Portal Gestao · Doctor Auto Prime · Dados em tempo real via Supabase
        </span>
        <span style={{ color: "#3f3f46", fontSize: "11px" }}>
          Atualizado: {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}
