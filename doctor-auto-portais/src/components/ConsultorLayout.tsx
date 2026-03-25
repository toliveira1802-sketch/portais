import { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"

const navPrincipal = [
  { icon:"🏠", label:"Dashboard", key:"dashboard" },
  { icon:"👁", label:"Visao Geral", key:"visao-geral" },
  { icon:"➕", label:"Nova OS", key:"nova-os" },
  { icon:"🚗", label:"Patio Kanban", key:"patio" },
  { icon:"📅", label:"Agendamentos", key:"agendamentos" },
]
const navCadastro = [
  { icon:"👤", label:"Clientes", key:"clientes" },
  { icon:"📋", label:"Ordens de Servico", key:"ordens" },
]
const navGestao = [
  { icon:"💰", label:"Financeiro", key:"financeiro" },
  { icon:"📈", label:"Produtividade", key:"produtividade" },
  { icon:"⚙️", label:"Operacional", key:"operacional" },
  { icon:"📊", label:"Relatorios", key:"relatorios" },
]

export default function ConsultorLayout({ children, activeKey, onNavigate }: { children: ReactNode; activeKey: string; onNavigate: (k: string) => void }) {
  const { consultor, company, logout } = useAuth()

  const NavItem = ({ item }: { item: any }) => {
    const active = activeKey === item.key
    return (
      <button onClick={() => onNavigate(item.key)} style={{
        display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px",
        borderRadius:"8px", width:"100%", textAlign:"left",
        background: active ? "#1d4ed8" : "transparent",
        border:"1px solid transparent",
        color: active ? "#fff" : "#9ca3af",
        cursor:"pointer", fontSize:"14px", fontWeight: active ? "600" : "400",
        transition:"all 0.15s", fontFamily:"inherit"
      }}
        onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.06)" }}
        onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background="transparent" }}
      >
        <span style={{ fontSize:"15px", width:"20px", textAlign:"center" }}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0f1117", fontFamily:"'Inter',sans-serif", color:"#e2e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}`}</style>

      <aside style={{ width:"220px", minHeight:"100vh", background:"#161b27", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0, zIndex:100, overflowY:"auto" }}>

        <div style={{ padding:"20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", background:"#1d4ed8", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"800", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px" }}>Doctor Auto</div>
            <div style={{ color:"#3b82f6", fontSize:"11px" }}>Consultor</div>
          </div>
        </div>

        <div style={{ padding:"12px 8px 4px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {navPrincipal.map(item => <NavItem key={item.key} item={item} />)}
        </div>

        <div style={{ padding:"0 8px 8px" }}>
          <div style={{ padding:"8px 12px 4px", color:"#374151", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase" }}>Cadastro</div>
          {navCadastro.map(item => <NavItem key={item.key} item={item} />)}
        </div>

        <div style={{ padding:"0 8px 8px" }}>
          <div style={{ padding:"8px 12px 4px", color:"#374151", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase" }}>Gestao</div>
          {navGestao.map(item => <NavItem key={item.key} item={item} />)}
        </div>

        <div style={{ marginTop:"auto", padding:"16px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color:"#6b7280", fontSize:"11px", marginBottom:"2px" }}>Logado como</div>
          <div style={{ color:"#f1f5f9", fontSize:"13px", fontWeight:"600" }}>{consultor?.nome?.split(" ").slice(0,2).join(" ")}</div>
          <div style={{ color:"#6b7280", fontSize:"11px", marginBottom:"12px" }}>Consultor</div>
          <button onClick={logout} style={{ display:"flex", alignItems:"center", gap:"6px", background:"transparent", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", fontWeight:"500", padding:"0" }}>
            🚪 Sair
          </button>
        </div>
      </aside>

      <main style={{ flex:1, marginLeft:"220px", display:"flex", flexDirection:"column" }}>
        <header style={{ padding:"16px 32px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#161b27", position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontSize:"20px", fontWeight:"700", color:"#fff" }}>
              {[...navPrincipal,...navCadastro,...navGestao].find(n=>n.key===activeKey)?.label||"Dashboard"}
            </h1>
            <p style={{ color:"#6b7280", fontSize:"13px", marginTop:"2px" }}>{company?.nome} - Visao geral em tempo real</p>
          </div>
          <button onClick={() => onNavigate("nova-os")} style={{ padding:"10px 20px", background:"#1d4ed8", border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:"pointer" }}>
            + Nova OS
          </button>
        </header>
        <div style={{ flex:1, padding:"28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}

export function BtnPrimary({ onClick, children, disabled }: { onClick?: () => void; children: ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding:"10px 20px", background:disabled?"rgba(29,78,216,0.4)":"#1d4ed8", border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit" }}>{children}</button>
}
export function BtnSecondary({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return <button onClick={onClick} style={{ padding:"10px 20px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#9ca3af", fontSize:"14px", cursor:"pointer", fontFamily:"inherit" }}>{children}</button>
}