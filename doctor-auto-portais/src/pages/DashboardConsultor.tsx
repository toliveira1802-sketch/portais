import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getDashboardStats } from "../lib/supabase"

const gestaoCards = [
  { label:"Operacional", sub:"Patio e OS em andamento", icon:"🔧", bg:"#1e3a5f", accent:"#3b82f6", key:"operacional" },
  { label:"Financeiro", sub:"Faturamento e metas", icon:"💰", bg:"#14321e", accent:"#22c55e", key:"financeiro" },
  { label:"Produtividade", sub:"Ranking e performance", icon:"📊", bg:"#2d1b4e", accent:"#a855f7", key:"produtividade" },
  { label:"Agenda do Dia", sub:"Grade horaria dos mecanicos", icon:"📅", bg:"#3b1f08", accent:"#f59e0b", key:"agendamentos" },
]

export default function DashboardConsultor({ onNavigate }: { onNavigate?: (k: string) => void }) {
  const { consultor, company } = useAuth()
  const [stats, setStats] = useState({ osAbertas:0, osHoje:0, clientesNoMes:0, faturamentoMes:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (consultor?.empresa_id) load() }, [consultor])

  const load = async () => {
    try { setStats(await getDashboardStats(consultor!.empresa_id)) }
    catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"

  const cards = [
    { label:"Veiculos no Patio", value:stats.osAbertas, icon:"🚗", bg:"#1e3a5f", color:"#93c5fd" },
    { label:"Agendamentos Hoje", value:stats.osHoje, icon:"📅", bg:"#1a2e1a", color:"#86efac" },
    { label:"Faturamento Mes", value:stats.faturamentoMes.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), icon:"💰", bg:"#1e3a2e", color:"#6ee7b7" },
    { label:"Entregas no Mes", value:stats.clientesNoMes, icon:"🔑", bg:"#3b2a0a", color:"#fcd34d" },
  ]

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ marginBottom:"4px" }}>
        <p style={{ color:"#52525b", fontSize:"14px", margin:"0 0 4px" }}>
          {saudacao}, {consultor?.nome?.split(" ")[0]} 👋
        </p>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <p style={{ color:"#71717a", fontSize:"13px", margin:0 }}>
            {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
          </p>
          {company && (
            <span style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"99px", padding:"2px 10px", fontSize:"12px", color:"#52525b" }}>
              {company.nome}
            </span>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        {cards.map((c,i) => (
          <div key={i} style={{ background:c.bg, borderRadius:"14px", padding:"18px 20px", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"14px" }}>
              <span style={{ fontSize:"20px" }}>{c.icon}</span>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:c.color }} />
            </div>
            <div style={{ fontSize:"24px", fontWeight:"700", color:c.color, marginBottom:"4px" }}>
              {loading ? "..." : c.value}
            </div>
            <div style={{ fontSize:"12px", color:"#71717a" }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#111113", border:"1px solid #27272a", borderRadius:"14px", padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#3b82f6" }} />
            <span style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px" }}>Pendencias do dia</span>
          </div>
          <button style={{ background:"transparent", border:"none", color:"#52525b", fontSize:"12px", cursor:"pointer" }}>
            Ver todas
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", color:"#22c55e", fontSize:"13px" }}>
          <span>✓</span> Nenhuma pendencia para hoje. Bom trabalho!
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        {gestaoCards.map((c,i) => (
          <div key={i} onClick={() => onNavigate?.(c.key)}
            style={{ background:c.bg, borderRadius:"14px", padding:"18px", border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", transition:"transform 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
          >
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"24px" }}>
              <div style={{ width:"38px", height:"38px", background:"rgba(255,255,255,0.08)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{c.icon}</div>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"16px" }}>→</span>
            </div>
            <div style={{ color:c.accent, fontWeight:"600", fontSize:"14px", marginBottom:"4px" }}>{c.label}</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px" }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
