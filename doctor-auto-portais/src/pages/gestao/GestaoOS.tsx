import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

type OS = {
  id_os: string; numero_os: number; status: string; prioridade: string
  reclamacao_cliente?: string; valor_final: number; data_entrada: string
  data_previsao?: string; data_conclusao?: string
  cliente?: { nome: string; telefone?: string }
  veiculo?: { placa: string; marca?: string; modelo?: string }
  consultor?: { nome: string }
  mecanico?: { nome: string }
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label: "Aberta", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  em_andamento: { label: "Em Andamento", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  aguardando_peca: { label: "Aguard. Peca", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  aguardando_aprovacao: { label: "Aguard. Aprovacao", color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  finalizada: { label: "Finalizada", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  entregue: { label: "Entregue", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  cancelada: { label: "Cancelada", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
}

export default function GestaoOS() {
  const [ordens, setOrdens] = useState<OS[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")

  useEffect(() => { fetchOS() }, [])

  const fetchOS = async () => {
    try {
      const { data } = await supabase.from("ordens_servico")
        .select("*, cliente:id_cliente(nome,telefone), veiculo:id_veiculo(placa,marca,modelo), consultor:id_consultor(nome), mecanico:id_mecanico(nome)")
        .eq("id_companies", EMPRESA_ID)
        .order("created_at", { ascending: false })
        .limit(200)
      setOrdens((data as any) || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const filtradas = ordens.filter(os => {
    if (filtroStatus !== "todos" && os.status !== filtroStatus) return false
    if (busca) {
      const b = busca.toLowerCase()
      return (
        String(os.numero_os).includes(b) ||
        os.cliente?.nome?.toLowerCase().includes(b) ||
        os.veiculo?.placa?.toLowerCase().includes(b)
      )
    }
    return true
  })

  const contagens = ordens.reduce((acc, os) => {
    acc[os.status] = (acc[os.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px 20px" }
  const inp: React.CSSProperties = { padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit" }

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>OS Ultimate</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Visao completa de todas as ordens de servico</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "#71717a", fontSize: "12px" }}>{filtradas.length} OS</span>
        </div>
      </div>

      {/* Status counters */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => setFiltroStatus("todos")} style={{ ...inp, cursor: "pointer", background: filtroStatus === "todos" ? "#7c3aed" : "rgba(255,255,255,0.05)", color: filtroStatus === "todos" ? "#fff" : "#71717a", fontWeight: "600", border: "none", borderRadius: "99px", padding: "6px 14px", fontSize: "12px" }}>
          Todos ({ordens.length})
        </button>
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          contagens[k] ? (
            <button key={k} onClick={() => setFiltroStatus(k)} style={{ cursor: "pointer", background: filtroStatus === k ? v.bg : "rgba(255,255,255,0.03)", color: v.color, fontWeight: "600", border: `1px solid ${filtroStatus === k ? v.color + "40" : "transparent"}`, borderRadius: "99px", padding: "6px 14px", fontSize: "12px", fontFamily: "inherit" }}>
              {v.label} ({contagens[k]})
            </button>
          ) : null
        ))}
      </div>

      {/* Search */}
      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por numero, cliente ou placa..." style={{ ...inp, width: "100%", maxWidth: "400px", boxSizing: "border-box" }} />

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["#OS", "Cliente", "Veiculo", "Status", "Consultor", "Mecanico", "Valor", "Entrada", "Previsao"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#71717a", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>Carregando...</td></tr>
              ) : filtradas.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>Nenhuma OS encontrada</td></tr>
              ) : (
                filtradas.map(os => {
                  const st = STATUS_MAP[os.status] || { label: os.status, color: "#71717a", bg: "rgba(255,255,255,0.05)" }
                  return (
                    <tr key={os.id_os} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 14px", color: "#a78bfa", fontWeight: "700" }}>#{os.numero_os}</td>
                      <td style={{ padding: "12px 14px", color: "#e4e4e7" }}>{os.cliente?.nome || "—"}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ color: "#e4e4e7", fontWeight: "600" }}>{os.veiculo?.placa || "—"}</span>
                        {os.veiculo?.marca && <span style={{ color: "#52525b", marginLeft: "6px", fontSize: "12px" }}>{os.veiculo.marca} {os.veiculo.modelo}</span>}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: st.bg, color: st.color, padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>{st.label}</span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#71717a" }}>{(os.consultor as any)?.nome || "—"}</td>
                      <td style={{ padding: "12px 14px", color: "#71717a" }}>{(os.mecanico as any)?.nome || "—"}</td>
                      <td style={{ padding: "12px 14px", color: "#22c55e", fontWeight: "600" }}>R$ {os.valor_final?.toFixed(2) || "0.00"}</td>
                      <td style={{ padding: "12px 14px", color: "#71717a", fontSize: "12px" }}>{os.data_entrada ? new Date(os.data_entrada).toLocaleDateString("pt-BR") : "—"}</td>
                      <td style={{ padding: "12px 14px", color: os.data_previsao && new Date(os.data_previsao) < new Date() && !["finalizada", "entregue", "cancelada"].includes(os.status) ? "#f87171" : "#71717a", fontSize: "12px" }}>
                        {os.data_previsao ? new Date(os.data_previsao).toLocaleDateString("pt-BR") : "—"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
