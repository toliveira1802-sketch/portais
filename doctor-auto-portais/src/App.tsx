import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import SelecionarPerfil from "./pages/SelecionarPerfil"
import LoginConsultor from "./pages/LoginConsultor"
import ConsultorLayout from "./components/ConsultorLayout"
import DashboardConsultor from "./pages/DashboardConsultor"
import PatioPagina from "./pages/PatioPagina"
import Agendamentos from "./pages/Agendamentos"
import ClientesPagina from "./pages/ClientesPagina"
import OrdensPagina from "./pages/OrdensPagina"
import NovaOS from "./pages/NovaOS"
import GestaoLayout from "./components/GestaoLayout"
import GestaoDashboard from "./pages/gestao/GestaoDashboard"
import MecanicoOSPage from "./pages/mecanico/MecanicoOS"
import ClienteDashboardPage from "./pages/cliente/ClienteDashboard"
import DevLayout from "./components/DevLayout"
import DevDashboard from "./pages/dev/DevDashboard"
import DevUsuarios from "./pages/dev/DevUsuarios"
import DevBanco from "./pages/dev/DevBanco"
import DevLogs from "./pages/dev/DevLogs"
import DevAPI from "./pages/dev/DevAPI"
import DevDocs from "./pages/dev/DevDocs"
import DevIntegracoes from "./pages/dev/DevIntegracoes"
import DevIAPortal from "./pages/dev/DevIAPortal"
import DevPerfilIA from "./pages/dev/DevPerfilIA"
import DevIAQG from "./pages/dev/DevIAQG"

type Portal = "selecionar" | "login-consultor" | "login-gestao" | "login-mecanico" | "login-cliente" | "login-dev"
type ConsultorPage = "dashboard" | "patio" | "nova-os" | "clientes" | "ordens" | "visao-geral" | "agendamentos" | "financeiro" | "produtividade" | "agenda-mec" | "avaliacao-diaria"
type GestaoPg = "gestao-visao" | "gestao-os" | "gestao-metas" | "gestao-melhorias" | "gestao-financeiro" | "gestao-comercial" | "gestao-fornecedores" | "gestao-operacoes" | "gestao-rh" | "gestao-tecnologia" | "gestao-orfaos"
type MecPg = "mec-os" | "mec-checklist" | "mec-agenda" | "mec-patio"
type CliPg = "cli-dashboard" | "cli-veiculos" | "cli-os" | "cli-avaliacoes"
type DevPg = "dev-dashboard" | "dev-navigator" | "dev-logs" | "dev-config" | "dev-docs" | "dev-api" | "dev-permissoes" | "dev-integracoes" | "dev-ia-qg" | "dev-perfil-ia" | "dev-ia-portal" | "dev-tables" | "dev-usuarios" | "dev-banco" | "dev-sql" | "dev-processos" | "dev-ferramentas" | "sidebar-gestao" | "sidebar-consultor" | "sidebar-mecanico"

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
    if (page === "agendamentos") return <Agendamentos />
    if (page === "clientes") return <ClientesPagina />
    if (page === "ordens") return <OrdensPagina onNavigate={(k) => setPage(k as ConsultorPage)} />
    if (page === "nova-os") return <NovaOS onNavigate={(k) => setPage(k as ConsultorPage)} />
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

// ── PORTAL DEV ──────────────────────────────────────────────────
function PortalDev({ onLogout, onBack }: { onLogout: () => void; onBack: () => void }) {
  const [logado, setLogado] = useState(false)
  const [userName, setUserName] = useState("")
  const [page, setPage] = useState<DevPg>("dev-dashboard")
  const [loginErr, setLoginErr] = useState("")
  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginUser || !loginPass) { setLoginErr("Preencha usuario e senha"); return }
    setLoginLoading(true)
    setLoginErr("")
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const sb = createClient(
        import.meta.env.VITE_SUPABASE_URL || "https://acuufrgoyjwzlyhopaus.supabase.co",
        import.meta.env.VITE_SUPABASE_ANON_KEY || ""
      )
      const { data: dev } = await sb.from("colaboradores_portal_dev")
        .select("*")
        .or(`username.eq.${loginUser},email.eq.${loginUser}`)
        .single()
      if (!dev) { setLoginErr("Usuario nao encontrado"); setLoginLoading(false); return }
      if (!dev.ativo) { setLoginErr("Usuario inativo"); setLoginLoading(false); return }
      setUserName(dev.nome.split(" ").slice(0, 2).join(" "))
      setLogado(true)
    } catch {
      setLoginErr("Erro ao autenticar")
    } finally {
      setLoginLoading(false)
    }
  }

  if (!logado) {
    const inp: React.CSSProperties = {
      width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7",
      fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit"
    }
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", background: "#10b981", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#fff", fontSize: "13px" }}>DA</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#fff", fontWeight: "700" }}>Doctor Auto</div>
                <div style={{ color: "#71717a", fontSize: "12px" }}>Portal Developer</div>
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>Acesso Dev</h1>
            <p style={{ color: "#71717a", fontSize: "13px" }}>Restrito a desenvolvedores</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", color: "#71717a", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Usuario ou Email</label>
                <input style={inp} value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="THALES_DEV" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "#71717a", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Senha</label>
                <input type="password" style={inp} value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" />
              </div>
              {loginErr && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "10px 12px", color: "#fca5a5", fontSize: "13px", marginBottom: "14px" }}>{loginErr}</div>}
              <button type="submit" disabled={loginLoading} style={{ width: "100%", padding: "13px", background: loginLoading ? "rgba(16,185,129,0.5)" : "#10b981", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: loginLoading ? "wait" : "pointer", fontFamily: "inherit" }}>
                {loginLoading ? "Verificando..." : "Entrar"}
              </button>
            </form>
          </div>
          <button onClick={onBack} style={{ marginTop: "16px", display: "block", textAlign: "center", width: "100%", background: "transparent", border: "none", color: "#52525b", cursor: "pointer", fontSize: "13px" }}>
            ← Voltar
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    if (page === "dev-dashboard") return <DevDashboard onNavigate={(k) => setPage(k as DevPg)} />
    if (page === "dev-usuarios") return <DevUsuarios />
    if (page === "dev-banco" || page === "dev-tables") return <DevBanco />
    if (page === "dev-logs") return <DevLogs />
    if (page === "dev-api") return <DevAPI />
    if (page === "dev-docs") return <DevDocs />
    if (page === "dev-integracoes") return <DevIntegracoes />
    if (page === "dev-ia-portal") return <DevIAPortal />
    if (page === "dev-perfil-ia") return <DevPerfilIA />
    if (page === "dev-ia-qg") return <DevIAQG />
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "48px" }}>🚧</div>
        <h2 style={{ color: "#e4e4e7", fontSize: "20px", fontWeight: "600" }}>{page}</h2>
        <p style={{ color: "#71717a", fontSize: "14px" }}>Em construcao</p>
      </div>
    )
  }

  return (
    <DevLayout activeKey={page} onNavigate={(k) => setPage(k as DevPg)} onLogout={onLogout} userName={userName}>
      {renderPage()}
    </DevLayout>
  )
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
    else if (k === "dev") setPortal("login-dev")
  }} />

  if (portal === "login-consultor") return (
    <AuthProvider>
      <PortalConsultor onLogout={reset} onBack={reset} />
    </AuthProvider>
  )

  if (portal === "login-gestao") return <PortalGestao onLogout={reset} onBack={reset} />
  if (portal === "login-mecanico") return <PortalMecanico onLogout={reset} onBack={reset} />
  if (portal === "login-cliente") return <PortalCliente onLogout={reset} onBack={reset} />
  if (portal === "login-dev") return <PortalDev onLogout={reset} onBack={reset} />

  return null
}

export default function App() {
  return <MainApp />
}
