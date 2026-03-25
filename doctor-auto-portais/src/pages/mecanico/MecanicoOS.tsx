import MecanicoLayout from "../../components/MecanicoLayout"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

const STATUS: Record<string, { label: string; c: string; bg: string }> = {
  aberta: { label: "Aberta", c: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  em_andamento: { label: "Em Execucao", c: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  aguardando_peca: { label: "Aguard. Peca", c: "#f87171", bg: "rgba(248,113,113,0.1)" },
  aguardando_aprovacao: { label: "Aguard. Aprov.", c: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  finalizada: { label: "Finalizada", c: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  entregue: { label: "Entregue", c: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  cancelada: { label: "Cancelada", c: "#a1a1aa", bg: "rgba(161,161,170,0.1)" },
}

export default function MecanicoOSPage({ onNavigate, onLogout }: { onNavigate: (k: string) => void; onLogout: () => void }) {
  const [filter, setFilter] = useState("todos")
  const [ordens, setOrdens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOS()
  }, [])

  const fetchOS = async () => {
    const { data } = await supabase.from("ordens_servico")
      .select("*, cliente:id_cliente(nome,telefone), veiculo:id_veiculo(placa,marca,modelo)")
      .eq("id_companies", EMPRESA_ID)
      .in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"])
      .order("created_at", { ascending: false })
    setOrdens(data || [])
    setLoading(false)
  }

  const filtered = filter === "todos" ? ordens : ordens.filter(o => o.status === filter)

  const counts = {
    em_andamento: ordens.filter(o => o.status === "em_andamento").length,
    aguardando_peca: ordens.filter(o => o.status === "aguardando_peca").length,
    aguardando_aprovacao: ordens.filter(o => o.status === "aguardando_aprovacao").length,
    aberta: ordens.filter(o => o.status === "aberta").length,
  }

  return (
    <MecanicoLayout activeKey="mec-os" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ padding: "28px 32px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Minhas OS</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>OS atribuidas — dados em tempo real</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Em Execucao", c: "#fb923c", bg: "rgba(251,146,60,0.08)", b: "rgba(251,146,60,0.2)", v: counts.em_andamento },
            { label: "Aguard. Peca", c: "#f87171", bg: "rgba(248,113,113,0.08)", b: "rgba(248,113,113,0.2)", v: counts.aguardando_peca },
            { label: "Aguard. Aprov.", c: "#a78bfa", bg: "rgba(167,139,250,0.08)", b: "rgba(167,139,250,0.2)", v: counts.aguardando_aprovacao },
            { label: "Abertas", c: "#60a5fa", bg: "rgba(96,165,250,0.08)", b: "rgba(96,165,250,0.2)", v: counts.aberta },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.b}`, borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: c.c }}>{loading ? "..." : c.v}</div>
              <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["todos", "em_andamento", "aguardando_peca", "aguardando_aprovacao", "aberta"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: "99px", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
              background: filter === f ? "#ea580c" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#fff" : "#71717a",
              border: `1px solid ${filter === f ? "#ea580c" : "rgba(255,255,255,0.1)"}`
            }}>{f === "todos" ? "Todas" : STATUS[f]?.label || f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Carregando OS...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Nenhuma OS encontrada</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.map(os => {
              const s = STATUS[os.status] || { label: os.status, c: "#a1a1aa", bg: "rgba(161,161,170,0.1)" }
              return (
                <div key={os.id_os} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "14px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div>
                      <span style={{ color: "#ea580c", fontWeight: "700", fontSize: "13px", fontFamily: "monospace" }}>OS-{String(os.numero_os).padStart(5, "0")}</span>
                      {os.prioridade === "urgente" && <span style={{ marginLeft: "8px", fontSize: "11px", background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)", padding: "2px 7px", borderRadius: "99px" }}>URGENTE</span>}
                      {os.prioridade === "alta" && <span style={{ marginLeft: "8px", fontSize: "11px", background: "rgba(245,158,11,0.1)", color: "#fde68a", border: "1px solid rgba(245,158,11,0.2)", padding: "2px 7px", borderRadius: "99px" }}>ALTA</span>}
                      <div style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "15px", marginTop: "4px" }}>{os.cliente?.nome || "—"}</div>
                      <div style={{ color: "#71717a", fontSize: "12px" }}>{os.veiculo?.placa} · {os.veiculo?.marca} {os.veiculo?.modelo}</div>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600", background: s.bg, color: s.c }}>{s.label}</span>
                  </div>
                  {os.reclamacao_cliente && (
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "8px 12px", color: "#d4d4d8", fontSize: "13px", marginBottom: "10px" }}>{os.reclamacao_cliente}</div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#52525b", fontSize: "12px" }}>
                    <span>KM: {os.km_entrada?.toLocaleString() || "—"}</span>
                    <span>⏰ {os.data_previsao ? new Date(os.data_previsao).toLocaleDateString("pt-BR") : "Sem previsao"}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MecanicoLayout>
  )
}
