import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import SelecionarPerfil from "./pages/SelecionarPerfil"
import LoginConsultor from "./pages/LoginConsultor"
import ConsultorLayout from "./components/ConsultorLayout"
import DashboardConsultor from "./pages/DashboardConsultor"
import PatioPagina from "./pages/PatioPagina"
import GestaoLayout from "./components/GestaoLayout"
import GestaoDashboard from "./pages/gestao/GestaoDashboard"
import MecanicoOSPage from "./pages/mecanico/MecanicoOS"
import ClienteDashboardPage from "./pages/cliente/ClienteDashboard"

type Portal = "selecionar" | "login-consultor" | "login-gestao" | "login-mecanico" | "login-cliente"
type ConsultorPage = "dashboard" | "patio" | "nova-os" | "clientes" | "ordens" | "visao-geral" | "agendamentos" | "financeiro" | "produtividade" | "operacional" | "relatorios"
type GestaoPg = "gestao-visao" | "gestao-os" | "gestao-metas" | "gestao-melhorias" | "gestao-financeiro" | "gestao-comercial" | "gestao-fornecedores" | "gestao-operacoes" | "gestao-rh" | "gestao-tecnologia" | "gestao-orfaos"
type MecPg = "mec-os" | "mec-checklist" | "mec-agenda" | "mec-patio"
type CliPg = "cli-dashboard" | "cli-veiculos" | "cli-os" | "cli-avaliacoes"

const Spinner = () => (
  <div style={{ minHeight:"100vh", background:"#09090b", display:"flex", alignItems:"center", justifyContent:"center", color:"#52525b", fontFamily:"sans-serif" }}>
    <div style={{ textAlign:"center" }}>
      <div style={{ width:"28px", height:"28px", border:"2px solid rgba(29,78,216,0.3)", borderTop:"2px solid #1d4ed8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      Carregando...
    </div>
  </div>
)

const EmConstrucao = ({ titulo, cor = "#1d4ed8" }: { titulo: string; cor?: string }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:"16px" }}>
    <div style={{ fontSize:"48px" }}>🚧</div>
    <h2 style={{ color:"#e4e4e7", fontSize:"20px", fontWeight:"600" }}>{titulo}</h2>
    <p style={{ color:"#71717a", fontSize:"14px" }}>Em construcao</p>
  </div>
)

// ── PORTAL CONSULTOR ────────────────────────────────────────────
function PortalConsultor({ onLogout, onBack }: { onLogout: () => void; onBack: () => void }) {
  const { consultor, loading } = useAuth()
  const [page, setPage] = useState<ConsultorPage>("dashboard")

  if (loading) return <Spinner />
  if (!consultor) return <LoginConsultor onBack={onBack} />

  const renderPage = () => {
    if (page === "dashboard") return <DashboardConsultor onNavigate={(k) => setPage(k as ConsultorPage)} />
    if (page === "patio") return <PatioPagina />
    return <EmConstrucao titulo={page} />
  }

  return (
    <ConsultorLayout activeKey={page} onNavigate={(k) => setPage(k as ConsultorPage)}>
      {renderPage()}
    </ConsultorLayout>
  )
}

// ── LOGIN SIMPLES (gestao, mecanico, cliente) ───────────────────
function LoginSimples({ titulo, cor, onLogin, onBack }: { titulo:string; cor:string; onLogin:()=>void; onBack:()=>void }) {
  const [u, setU] = useState("")
  const [p, setP] = useState("")
  const [err, setErr] = useState("")
  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#e4e4e7",
    fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit"
  }
  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!u || !p) { setErr("Preencha usuario e senha"); return }
    onLogin()
  }
  return (
    <div style={{ minHeight:"100vh", background:"#09090b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:"400px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
            <div style={{ width:"40px", height:"40px", background:cor, borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", color:"#fff", fontSize:"13px" }}>DA</div>
            <div style={{ textAlign:"left" }}>
              <div style={{ color:"#fff", fontWeight:"700" }}>Doctor Auto</div>
              <div style={{ color:"#71717a", fontSize:"12px" }}>{titulo}</div>
            </div>
          </div>
          <h1 style={{ color:"#fff", fontSize:"22px", fontWeight:"700", marginBottom:"6px" }}>Entrar</h1>
          <p style={{ color:"#71717a", fontSize:"13px" }}>Acesse o {titulo}</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"28px" }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom:"14px" }}>
              <label style={{ display:"block", color:"#71717a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>Usuario</label>
              <input style={inp} value={u} onChange={e=>setU(e.target.value)} placeholder="seu.usuario" />
            </div>
            <div style={{ marginBottom:"20px" }}>
              <label style={{ display:"block", color:"#71717a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>Senha</label>
              <input type="password" style={inp} value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"8px", padding:"10px 12px", color:"#fca5a5", fontSize:"13px", marginBottom:"14px" }}>{err}</div>}
            <button type="submit" style={{ width:"100%", padding:"13px", background:cor, border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"inherit" }}>
              Entrar
            </button>
          </form>
        </div>
        <button onClick={onBack} style={{ marginTop:"16px", display:"block", textAlign:"center", width:"100%", background:"transparent", border:"none", color:"#52525b", cursor:"pointer", fontSize:"13px" }}>
          ← Voltar
        </button>
      </div>
    </div>
  )
}

// ── PORTAL GESTAO ───────────────────────────────────────────────
function PortalGestao({ onLogout, onBack }: { onLogout:()=>void; onBack:()=>void }) {
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<GestaoPg>("gestao-visao")

  if (!logado) return <LoginSimples titulo="Portal Gestao" cor="#7c3aed" onLogin={() => setLogado(true)} onBack={onBack} />

  const renderPage = () => {
    if (page === "gestao-visao") return <GestaoDashboard onNavigate={(k) => setPage(k as GestaoPg)} />
    return <EmConstrucao titulo={page} />
  }

  return (
    <GestaoLayout activeKey={page} onNavigate={(k) => setPage(k as GestaoPg)} onLogout={onLogout}>
      <div>{renderPage()}</div>
    </GestaoLayout>
  )
}

// ── PORTAL MECANICO ─────────────────────────────────────────────
function PortalMecanico({ onLogout, onBack }: { onLogout:()=>void; onBack:()=>void }) {
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<MecPg>("mec-os")

  if (!logado) return <LoginSimples titulo="Portal Mecanico" cor="#ea580c" onLogin={() => setLogado(true)} onBack={onBack} />

  const renderPage = () => {
    if (page === "mec-os") return <MecanicoOSPage onNavigate={(k) => setPage(k as MecPg)} onLogout={onLogout} />
    return (
      <div style={{ padding:"28px 32px" }}>
        <EmConstrucao titulo={page} />
      </div>
    )
  }

  return <>{renderPage()}</>
}

// ── PORTAL CLIENTE ──────────────────────────────────────────────
function PortalCliente({ onLogout, onBack }: { onLogout:()=>void; onBack:()=>void }) {
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<CliPg>("cli-dashboard")

  if (!logado) return <LoginSimples titulo="Portal Cliente" cor="#0d9488" onLogin={() => setLogado(true)} onBack={onBack} />

  const renderPage = () => {
    if (page === "cli-dashboard") return <ClienteDashboardPage onNavigate={(k) => setPage(k as CliPg)} onLogout={onLogout} />
    return <div style={{ padding:"28px 32px" }}><EmConstrucao titulo={page} /></div>
  }

  return <>{renderPage()}</>
}

// ── MAIN APP ────────────────────────────────────────────────────
function MainApp() {
  const [portal, setPortal] = useState<Portal>("selecionar")

  const reset = () => setPortal("selecionar")

  if (portal === "selecionar") return <SelecionarPerfil onSelect={(k) => {
    if (k === "consultor") setPortal("login-consultor")
    else if (k === "gestao") setPortal("login-gestao")
    else if (k === "mecanico") setPortal("login-mecanico")
    else if (k === "cliente") setPortal("login-cliente")
  }} />

  if (portal === "login-consultor") return (
    <AuthProvider>
      <PortalConsultor onLogout={reset} onBack={reset} />
    </AuthProvider>
  )

  if (portal === "login-gestao") return <PortalGestao onLogout={reset} onBack={reset} />
  if (portal === "login-mecanico") return <PortalMecanico onLogout={reset} onBack={reset} />
  if (portal === "login-cliente") return <PortalCliente onLogout={reset} onBack={reset} />

  return null
}

export default function App() {
  return <MainApp />
}
