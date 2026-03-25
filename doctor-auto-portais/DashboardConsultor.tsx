import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getDashboardStats, getOrdensServico } from "../lib/supabase"

const SC: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label:"Aberta", color:"#60a5fa", bg:"rgba(96,165,250,0.1)" },
  em_andamento: { label:"Em andamento", color:"#fb923c", bg:"rgba(251,146,60,0.1)" },
  aguardando_peca: { label:"Aguard. peca", color:"#facc15", bg:"rgba(250,204,21,0.1)" },
  aguardando_aprovacao: { label:"Aguard. aprovacao", color:"#e879f9", bg:"rgba(232,121,249,0.1)" },
  finalizada: { label:"Finalizada", color:"#4ade80", bg:"rgba(74,222,128,0.1)" },
  entregue: { label:"Entregue", color:"#a3e635", bg:"rgba(163,230,53,0.1)" },
  cancelada: { label:"Cancelada", color:"#f87171", bg:"rgba(248,113,113,0.1)" },
}

export default function DashboardConsultor() {
  const { consultor, company } = useAuth()
  const [stats, setStats] = useState({ osAbertas:0, osHoje:0, clientesNoMes:0, faturamentoMes:0 })
  const [os, setOs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (consultor?.empresa_id) load() }, [consultor])

  const load = async () => {
    try {
      const [s, o] = await Promise.all([
        getDashboardStats(consultor!.empresa_id),
        getOrdensServico(consultor!.empresa_id, { consultor_id: consultor!.id })
      ])
      setStats(s)
      setOs((o as any[]).slice(0, 8))
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const cards = [
    { label:"OS Abertas", value:stats.osAbertas, icon:"ð§", color:"#fb923c" },
    { label:"OS Hoje", value:stats.osHoje, icon:"ð", color:"#60a5fa" },
    { label:"Novos Clientes", value:stats.clientesNoMes, icon:"ð¥", color:"#4ade80" },
    { label:"Faturamento Mes", value:stats.faturamentoMes.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), icon:"ð°", color:"#facc15" },
  ]

  return (
    <div>
      <div style={{ marginBottom:"28px" }}>
        <p style={{ color:"#555", fontSize:"14px", marginBottom:"4px" }}>
          {hora<12?"Bom dia":hora<18?"Boa tarde":"Boa noite"}, {consultor?.nome?.split(" ")[0]} ð
        </p>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <p style={{ color:"#888", fontSize:"14px", margin:0 }}>
            {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
          </p>
          {company && (
            <span style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"99px", padding:"2px 10px", fontSize:"12px", color:"#666" }}>
              {company.nome}
            </span>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"32px" }}>
        {cards.map((c,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
              <span style={{ fontSize:"22px" }}>{c.icon}</span>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:c.color, boxShadow:`0 0 6px ${c.color}` }} />
            </div>
            <div style={{ fontSize:"26px", fontWeight:"700", color:"#fff", marginBottom:"4px" }}>{loading?"...":c.value}</div>
            <div style={{ fontSize:"13px", color:"#555" }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", overflow:"hidden" }}>
        <div style={{ padding:"18px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between" }}>
          <h2 style={{ fontSize:"15px", fontWeight:"600", color:"#ccc" }}>Minhas OS Recentes</h2>
          <span style={{ color:"#444", fontSize:"12px" }}>{os.length} registros</span>
        </div>

        {loading ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#444" }}>Carregando...</div>
        ) : os.length === 0 ? (
          <div style={{ padding:"48px", textAlign:"center" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>ð§</div>
            <div style={{ color:"#555", fontSize:"15px" }}>Nenhuma OS ainda</div>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>{["No OS","Cliente","Veiculo","Status","Valor","Data"].map(col => (
                <th key={col} style={{ padding:"12px 24px", textAlign:"left", color:"#3a3a3a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,0.04)", fontWeight:"500" }}>{col}</th>
              ))}</tr>
            </thead>
            <tbody>
              {os.map((o,i) => {
                const sc = SC[o.status] || SC.aberta
                return (
                  <tr key={o.id_os} style={{ borderBottom: i<os.length-1?"1px solid rgba(255,255,255,0.03)":"none" }}>
                    <td style={{ padding:"14px 24px", color:"#f87171", fontWeight:"600" }}>#{o.numero_os}</td>
                    <td style={{ padding:"14px 24px", color:"#ccc", fontSize:"14px" }}>{o.cliente?.nome||"Ã¯Â¿Â½"}</td>
                    <td style={{ padding:"14px 24px", color:"#888", fontSize:"13px" }}>
                      {o.veiculo ? `${o.veiculo.placa} ${o.veiculo.modelo||""}`.trim() : "Ã¯Â¿Â½"}
                    </td>
                    <td style={{ padding:"14px 24px" }}>
                      <span style={{ background:sc.bg, color:sc.color, padding:"4px 10px", borderRadius:"99px", fontSize:"12px" }}>{sc.label}</span>
                    </td>
                    <td style={{ padding:"14px 24px", color:"#ccc", fontSize:"14px" }}>
                      {o.valor_final ? o.valor_final.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "Ã¯Â¿Â½"}
                    </td>
                    <td style={{ padding:"14px 24px", color:"#555", fontSize:"13px" }}>
                      {new Date(o.data_entrada).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
