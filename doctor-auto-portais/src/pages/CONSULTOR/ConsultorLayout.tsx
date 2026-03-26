import { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"

const nav = [
  { icon:"🏠", label:"Dashboard", key:"dashboard" },
  { icon:"🔧", label:"Ordens de Servico", key:"ordens" },
  { icon:"👥", label:"Clientes", key:"clientes" },
  { icon:"🚗", label:"Veiculos", key:"veiculos" },
]

export default function ConsultorLayout({ children, activeKey, onNavigate }: { children: ReactNode; activeKey: string; onNavigate: (k: string) => void }) {
  const { consultor, company, logout } = useAuth()
  const initials = consultor?.nome ? consultor.nome.split(" ").slice(0,2).map((n:string) => n[0]).join("") : "C"

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0d0d0d", fontFamily:"sans-serif", color:"#e8e8e8" }}>
      <aside style={{ width:"240px", minHeight:"100vh", background:"#111", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0, zIndex:100 }}>
        <div style={{ padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", background:"linear-gradient(135deg,#dc2626,#991b1b)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"13px" }}>{company?.nome || "DOCTOR AUTO"}</div>
            <div style={{ color:"#555", fontSize:"11px" }}>CONSULTOR</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"16px 10px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {nav.map(item => {
            const active = activeKey === item.key
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)}
                style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"10px", background:active?"rgba(220,38,38,0.12)":"transparent", border:active?"1px solid rgba(220,38,38,0.2)":"1px solid transparent", color:active?"#f87171":"#666", cursor:"pointer", fontSize:"14px", fontWeight:active?"600":"400", width:"100%", textAlign:"left" }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"linear-gradient(135deg,#dc2626,#7f1d1d)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"13px", fontWeight:"700", flexShrink:0 }}>{initials}</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#ccc", fontSize:"13px", fontWeight:"500" }}>{consultor?.nome?.split(" ")[0]}</div>
            <div style={{ color:"#444", fontSize:"11px" }}>Consultor</div>
          </div>
          <button onClick={logout} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"6px 8px", color:"#555", cursor:"pointer", fontSize:"14px" }}>?</button>
        </div>
      </aside>
      <main style={{ flex:1, marginLeft:"240px", display:"flex", flexDirection:"column" }}>
        <header style={{ padding:"20px 32px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#0d0d0d", position:"sticky", top:0, zIndex:50 }}>
          <h1 style={{ fontSize:"20px", fontWeight:"700", color:"#fff" }}>{nav.find(n => n.key === activeKey)?.label}</h1>
        </header>
        <div style={{ flex:1, padding:"28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}

export function BtnPrimary({ onClick, children, disabled }: { onClick?: () => void; children: ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding:"11px 20px", background:disabled?"rgba(220,38,38,0.3)":"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit" }}>{children}</button>
}

export function BtnSecondary({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return <button onClick={onClick} style={{ padding:"11px 20px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#aaa", fontSize:"14px", cursor:"pointer", fontFamily:"inherit" }}>{children}</button>
}
