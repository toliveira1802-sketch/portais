import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

export default function GestaoOperacoes() {
  const [stats, setStats] = useState({ noPatio: 0, emAndamento: 0, aguardandoPeca: 0, aguardandoAprov: 0, finalizadas: 0, tempoMedio: 0 })
  const [osPatio, setOsPatio] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOps() }, [])

  const fetchOps = async () => {
    try {
      const [patioRes, tempoRes] = await Promise.all([
        supabase.from("ordens_servico")
          .select("id_os, numero_os, status, data_entrada, data_previsao, prioridade, cliente:id_cliente(nome), veiculo:id_veiculo(placa,marca,modelo), mecanico:id_mecanico(nome)")
          .eq("id_companies", EMPRESA_ID)
          .in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"])
          .order("data_entrada", { ascending: true }),
        supabase.from("ordens_servico")
          .select("data_entrada, data_conclusao")
          .eq("id_companies", EMPRESA_ID)
          .in("status", ["finalizada", "entregue"])
          .not("data_conclusao", "is", null)
          .limit(100)
      ])

      const os = patioRes.data || []
      setOsPatio(os)

      const aberta = os.filter(o => o.status === "aberta").length
      const andamento = os.filter(o => o.status === "em_andamento").length
      const peca = os.filter(o => o.status === "aguardando_peca").length
      const aprov = os.filter(o => o.status === "aguardando_aprovacao").length

      // Tempo medio em dias
      let totalDias = 0, count = 0
      tempoRes.data?.forEach((o: any) => {
        if (o.data_entrada && o.data_conclusao) {
          const dias = (new Date(o.data_conclusao).getTime() - new Date(o.data_entrada).getTime()) / (1000 * 60 * 60 * 24)
          if (dias > 0 && dias < 60) { totalDias += dias; count++ }
        }
      })

      setStats({ noPatio: os.length, emAndamento: andamento, aguardandoPeca: peca, aguardandoAprov: aprov, finalizadas: aberta, tempoMedio: count > 0 ? totalDias / count : 0 })
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  const diasNoPatio = (dataEntrada: string) => {
    const d = Math.floor((Date.now() - new Date(dataEntrada).getTime()) / (1000 * 60 * 60 * 24))
    return d
  }

  const STATUS_COR: Record<string, { label: string; color: string; bg: string }> = {
    aberta: { label: "Aberta", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    em_andamento: { label: "Em Andamento", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
    aguardando_peca: { label: "Aguard. Peca", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
    aguardando_aprovacao: { label: "Aguard. Aprov.", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  }

  const kpis = [
    { label: "No Patio", value: String(stats.noPatio), icon: "🚗", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    { label: "Em Andamento", value: String(stats.emAndamento), icon: "🔧", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    { label: "Aguardando Peca", value: String(stats.aguardandoPeca), icon: "📦", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
    { label: "Tempo Medio (dias)", value: stats.tempoMedio.toFixed(1), icon: "⏱️", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  ]

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Operacoes</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Controle operacional e veiculos no patio</p>
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

      {/* Veiculos no patio */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>Veiculos no Patio ({osPatio.length})</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#OS", "Placa", "Cliente", "Status", "Mecanico", "Dias", "Prioridade"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#71717a", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#52525b" }}>Carregando...</td></tr>
              ) : osPatio.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#52525b" }}>Patio vazio</td></tr>
              ) : osPatio.map(os => {
                const st = STATUS_COR[os.status] || { label: os.status, color: "#71717a", bg: "rgba(255,255,255,0.05)" }
                const dias = diasNoPatio(os.data_entrada)
                return (
                  <tr key={os.id_os} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "10px 14px", color: "#a78bfa", fontWeight: "700" }}>#{os.numero_os}</td>
                    <td style={{ padding: "10px 14px", color: "#e4e4e7", fontWeight: "600" }}>{os.veiculo?.placa || "—"}</td>
                    <td style={{ padding: "10px 14px", color: "#d4d4d8" }}>{os.cliente?.nome || "—"}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ background: st.bg, color: st.color, padding: "3px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "#71717a" }}>{(os.mecanico as any)?.nome || "Sem mecanico"}</td>
                    <td style={{ padding: "10px 14px", color: dias > 5 ? "#f87171" : dias > 3 ? "#fbbf24" : "#71717a", fontWeight: dias > 3 ? "700" : "400" }}>{dias}d</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ color: os.prioridade === "alta" || os.prioridade === "urgente" ? "#f87171" : "#71717a", fontSize: "12px", textTransform: "capitalize" }}>{os.prioridade || "normal"}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
