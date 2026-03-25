import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getOrdensServico, updateOrdemServico } from "../lib/supabase"

const WORKFLOW = [
  { key:"aberta", label:"Agendado", cor:"#6b7280" },
  { key:"em_andamento", label:"Diagnostico", cor:"#3b82f6" },
  { key:"aguardando_peca", label:"Orcamento", cor:"#8b5cf6" },
  { key:"aguardando_aprovacao", label:"Aguard. Aprovar", cor:"#f59e0b" },
  { key:"aguardando_iniciar", label:"Aguard. Iniciar", cor:"#fb923c" },
  { key:"execucao", label:"Em Execucao", cor:"#ef4444" },
  { key:"em_teste", label:"Em Teste", cor:"#06b6d4" },
  { key:"pronta", label:"Pronto", cor:"#22c55e" },
  { key:"entregue", label:"Entregue", cor:"#a3e635" },
  { key:"cancelada", label:"Cancelado", cor:"#9ca3af" },
]

const BOXES = [
  ["Box A","Box B","Box C","Elevador A"],
  ["Elevador B","Box D","Box E","Box F"],
  ["Box G","BORRACHARIA","Box H","Garagem Temporaria"],
  ["Box I","Recepcao","Diagnostico","Saida Administrativa"],
]

export default function PatioPagina() {
  const { consultor } = useAuth()
  const [view, setView] = useState<"kanban"|"mapa">("kanban")
  const [os, setOs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string|null>(null)

  useEffect(() => { if (consultor?.empresa_id) load() }, [consultor])

  const load = async () => {
    try {
      const data = await getOrdensServico(consultor!.empresa_id)
      setOs((data as any[]) || [])
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const moveOs = async (id: string, newStatus: string) => {
    setOs(prev => prev.map(o => o.id_os === id ? {...o, status: newStatus} : o))
    try { await updateOrdemServico(id, { status: newStatus }) }
    catch(e) { console.error(e); load() }
  }

  const osByStatus = (status: string) => os.filter(o => o.status === status)

  const cardStyle: React.CSSProperties = {
    background:"#1e2433", border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"10px", padding:"12px", marginBottom:"8px",
    cursor:"grab", userSelect:"none"
  }

  return (
    <div style={{ height:"calc(100vh - 120px)", display:"flex", flexDirection:"column", gap:"16px" }}>
      <style>{`* { box-sizing:border-box; } ::-webkit-scrollbar{width:4px;height:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}`}</style>

      {/* Toggle Kanban / Mapa */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
        <div style={{ display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"3px" }}>
          {(["kanban","mapa"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"7px 20px", borderRadius:"8px", border:"none", cursor:"pointer",
              background: view===v ? "#1d4ed8" : "transparent",
              color: view===v ? "#fff" : "#6b7280",
              fontSize:"13px", fontWeight: view===v ? "600" : "400",
              fontFamily:"inherit", transition:"all 0.15s"
            }}>
              {v === "kanban" ? "Kanban" : "Mapa"}
            </button>
          ))}
        </div>
        <span style={{ color:"#4b5563", fontSize:"13px" }}>
          {os.length} OS ativas
        </span>
        <div style={{ flex:1 }} />
        {/* Legenda status */}
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {[
            {label:"Em Execucao", cor:"#ef4444"},
            {label:"Aguardando", cor:"#f59e0b"},
            {label:"Pronto", cor:"#22c55e"},
            {label:"Outros", cor:"#6b7280"},
          ].map(l => (
            <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:l.cor }} />
              <span style={{ color:"#6b7280", fontSize:"11px" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KANBAN VIEW */}
      {view === "kanban" && (
        <div style={{ flex:1, overflowX:"auto", overflowY:"hidden" }}>
          <div style={{ display:"flex", gap:"10px", height:"100%", minWidth:"max-content", paddingBottom:"8px" }}>
            {WORKFLOW.map(col => (
              <div key={col.key}
                style={{ width:"180px", flexShrink:0, display:"flex", flexDirection:"column" }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault()
                  if (dragging) moveOs(dragging, col.key)
                  setDragging(null)
                }}
              >
                {/* Header coluna */}
                <div style={{
                  padding:"8px 12px", borderRadius:"8px 8px 0 0",
                  background:`${col.cor}22`, borderBottom:`2px solid ${col.cor}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  marginBottom:"4px"
                }}>
                  <span style={{ color:col.cor, fontSize:"12px", fontWeight:"600" }}>{col.label}</span>
                  <span style={{
                    background:`${col.cor}33`, color:col.cor,
                    borderRadius:"99px", padding:"1px 7px", fontSize:"11px", fontWeight:"700"
                  }}>{osByStatus(col.key).length}</span>
                </div>

                {/* Cards */}
                <div style={{
                  flex:1, overflowY:"auto", padding:"4px",
                  background:"rgba(255,255,255,0.02)", borderRadius:"0 0 8px 8px",
                  minHeight:"100px"
                }}>
                  {loading ? (
                    <div style={{ color:"#374151", fontSize:"12px", textAlign:"center", padding:"16px" }}>...</div>
                  ) : osByStatus(col.key).length === 0 ? (
                    <div style={{ color:"#1f2937", fontSize:"11px", textAlign:"center", padding:"16px", border:"1px dashed rgba(255,255,255,0.05)", borderRadius:"8px", margin:"4px" }}>
                      Vazio
                    </div>
                  ) : osByStatus(col.key).map(o => (
                    <div key={o.id_os}
                      draggable
                      onDragStart={() => setDragging(o.id_os)}
                      onDragEnd={() => setDragging(null)}
                      style={{
                        ...cardStyle,
                        opacity: dragging === o.id_os ? 0.5 : 1,
                        borderLeft:`3px solid ${col.cor}`
                      }}
                    >
                      <div style={{ color:"#f87171", fontSize:"11px", fontWeight:"700", marginBottom:"4px" }}>
                        #{o.numero_os}
                      </div>
                      <div style={{ color:"#e2e8f0", fontSize:"12px", fontWeight:"500", marginBottom:"4px" }}>
                        {o.cliente?.nome || "—"}
                      </div>
                      <div style={{ color:"#6b7280", fontSize:"11px" }}>
                        {o.veiculo?.placa || "—"} {o.veiculo?.modelo ? `· ${o.veiculo.modelo}` : ""}
                      </div>
                      {o.data_previsao && (
                        <div style={{ color:"#9ca3af", fontSize:"10px", marginTop:"6px" }}>
                          📅 {new Date(o.data_previsao).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAPA VIEW */}
      {view === "mapa" && (
        <div style={{ flex:1, overflowY:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
            {BOXES.flat().map((box, i) => {
              const osNoBox = os.filter((_, idx) => idx % BOXES.flat().length === i).slice(0,2)
              const temOs = osNoBox.length > 0
              return (
                <div key={box} style={{
                  background: temOs ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                  border: temOs ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius:"12px", padding:"16px", minHeight:"120px",
                  display:"flex", flexDirection:"column", gap:"8px"
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color: temOs ? "#22c55e" : "#4b5563", fontSize:"12px", fontWeight:"600" }}>
                      {box}
                    </span>
                    {temOs && (
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
                    )}
                  </div>
                  {osNoBox.map(o => (
                    <div key={o.id_os} style={{
                      background:"rgba(255,255,255,0.04)", borderRadius:"8px",
                      padding:"8px", fontSize:"11px"
                    }}>
                      <div style={{ color:"#f87171", fontWeight:"700" }}>#{o.numero_os}</div>
                      <div style={{ color:"#9ca3af" }}>{o.veiculo?.placa || "—"}</div>
                    </div>
                  ))}
                  {!temOs && (
                    <div style={{ color:"#1f2937", fontSize:"11px", textAlign:"center", marginTop:"auto", marginBottom:"auto" }}>
                      Livre
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}