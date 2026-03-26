import { useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import SelecionarPerfil from "./pages/SelecionarPerfil"
import PortalConsultorStandalone from "./pages/PortalConsultorStandalone"
import GestaoLayout from "./components/GestaoLayout"
import GestaoDashboard from "./pages/gestao/GestaoDashboard"
import GestaoOS from "./pages/gestao/GestaoOS"
import GestaoMetas from "./pages/gestao/GestaoMetas"
import GestaoMelhorias from "./pages/gestao/GestaoMelhorias"
import GestaoFinanceiro from "./pages/gestao/GestaoFinanceiro"
import GestaoComercial from "./pages/gestao/GestaoComercial"
import GestaoFornecedores from "./pages/gestao/GestaoFornecedores"
import GestaoOperacoes from "./pages/gestao/GestaoOperacoes"
import GestaoRH from "./pages/gestao/GestaoRH"
import GestaoTecnologia from "./pages/gestao/GestaoTecnologia"
import GestaoOrfaos from "./pages/gestao/GestaoOrfaos"
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

// ── TIPOS ───────────────────────────────────────────────────────
type ConsultorPage = "dashboard" | "patio" | "nova-os" | "clientes" | "ordens" | "visao-geral" | "agendamentos" | "financeiro" | "produtividade" | "agenda-mec" | "avaliacao-diaria" // kept for reference
type GestaoPg = "gestao-visao" | "gestao-os" | "gestao-metas" | "gestao-melhorias" | "gestao-financeiro" | "gestao-comercial" | "gestao-fornecedores" | "gestao-operacoes" | "gestao-rh" | "gestao-tecnologia" | "gestao-orfaos"
type MecPg = "mec-os" | "mec-checklist" | "mec-agenda" | "mec-patio"
type CliPg = "cli-dashboard" | "cli-veiculos" | "cli-os" | "cli-avaliacoes"
type DevPg = "dev-dashboard" | "dev-navigator" | "dev-logs" | "dev-config" | "dev-docs" | "dev-api" | "dev-permissoes" | "dev-integracoes" | "dev-ia-qg" | "dev-perfil-ia" | "dev-ia-portal" | "dev-tables" | "dev-usuarios" | "dev-banco" | "dev-sql" | "dev-processos" | "dev-ferramentas" | "sidebar-gestao" | "sidebar-consultor" | "sidebar-mecanico"

// ── COMPONENTES AUXILIARES ──────────────────────────────────────
const Spinner = () => (
  <div style={{ minHeight:"100vh", background:"#09090b", display:"flex", alignItems:"center", justifyContent:"center", color:"#52525b", fontFamily:"sans-serif" }}>
    <div style={{ textAlign:"center" }}>
      <div style={{ width:"28px", height:"28px", border:"2px solid rgba(29,78,216,0.3)", borderTop:"2px solid #1d4ed8", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      Carregando...
    </div>
  </div>
)

const EmConstrucao = ({ titulo }: { titulo: string }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", flexDirection:"column", gap:"16px" }}>
    <div style={{ fontSize:"48px" }}>🚧</div>
    <h2 style={{ color:"#e4e4e7", fontSize:"20px", fontWeight:"600" }}>{titulo}</h2>
    <p style={{ color:"#71717a", fontSize:"14px" }}>Em construcao</p>
  </div>
)

// ── LOGIN COM VALIDACAO SUPABASE ────────────────────────────────
function LoginSimples({ titulo, cor, tabela, camposBusca, onLogin }: { titulo:string; cor:string; tabela:string; camposBusca?:string; onLogin:(user: any)=>void }) {
  const navigate = useNavigate()
  const [u, setU] = useState("")
  const [p, setP] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const inp: React.CSSProperties = {
    width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#e4e4e7",
    fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit"
  }
  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!u || !p) { setErr("Preencha usuario e senha"); return }
    setLoading(true); setErr("")
    try {
      const { supabase: sb } = await import("./lib/supabase")
      const campos = camposBusca || "username,email"
      const orFilter = campos.split(",").map(c => `${c.trim()}.eq.${u}`).join(",")
      const { data } = await sb.from(tabela).select("*").or(orFilter).single()
      if (!data) { setErr("Usuario nao encontrado"); setLoading(false); return }
      if (data.ativo === false) { setErr("Usuario inativo"); setLoading(false); return }
      onLogin(data)
    } catch { setErr("Erro ao autenticar") } finally { setLoading(false) }
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
              <label style={{ display:"block", color:"#71717a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>Usuario ou Email</label>
              <input style={inp} value={u} onChange={e=>setU(e.target.value)} placeholder="seu.usuario" />
            </div>
            <div style={{ marginBottom:"20px" }}>
              <label style={{ display:"block", color:"#71717a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"6px" }}>Senha</label>
              <input type="password" style={inp} value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"8px", padding:"10px 12px", color:"#fca5a5", fontSize:"13px", marginBottom:"14px" }}>{err}</div>}
            <button type="submit" disabled={loading} style={{ width:"100%", padding:"13px", background:loading?`${cor}80`:cor, border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:loading?"wait":"pointer", fontFamily:"inherit" }}>
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
        <button onClick={() => navigate("/")} style={{ marginTop:"16px", display:"block", textAlign:"center", width:"100%", background:"transparent", border:"none", color:"#52525b", cursor:"pointer", fontSize:"13px" }}>
          ← Voltar
        </button>
      </div>
    </div>
  )
}

// ── SELECIONAR PERFIL (wrapper com router) ──────────────────────
function SelecionarPerfilRoute() {
  const navigate = useNavigate()
  return <SelecionarPerfil onSelect={(k) => navigate(`/${k}`)} />
}

// ── PORTAL CONSULTOR (Standalone) ────────────────────────────────
function PortalConsultor() {
  return <PortalConsultorStandalone />
}

// ── PORTAL GESTAO ───────────────────────────────────────────────
function PortalGestao() {
  const navigate = useNavigate()
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<GestaoPg>("gestao-visao")

  if (!logado) return <LoginSimples titulo="Portal Gestao" cor="#7c3aed" tabela="colaboradores_portal_gestao" onLogin={() => setLogado(true)} />

  const renderPage = () => {
    if (page === "gestao-visao") return <GestaoDashboard onNavigate={(k) => setPage(k as GestaoPg)} />
    if (page === "gestao-os") return <GestaoOS />
    if (page === "gestao-metas") return <GestaoMetas />
    if (page === "gestao-melhorias") return <GestaoMelhorias />
    if (page === "gestao-financeiro") return <GestaoFinanceiro />
    if (page === "gestao-comercial") return <GestaoComercial />
    if (page === "gestao-fornecedores") return <GestaoFornecedores />
    if (page === "gestao-operacoes") return <GestaoOperacoes />
    if (page === "gestao-rh") return <GestaoRH />
    if (page === "gestao-tecnologia") return <GestaoTecnologia />
    if (page === "gestao-orfaos") return <GestaoOrfaos />
    return <EmConstrucao titulo={page} />
  }

  return (
    <GestaoLayout activeKey={page} onNavigate={(k) => setPage(k as GestaoPg)} onLogout={() => navigate("/")}>
      <div>{renderPage()}</div>
    </GestaoLayout>
  )
}

// ── PORTAL MECANICO ─────────────────────────────────────────────
function PortalMecanico() {
  const navigate = useNavigate()
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<MecPg>("mec-os")

  if (!logado) return <LoginSimples titulo="Portal Mecanico" cor="#ea580c" tabela="colaboradores_portal_mecanico" onLogin={() => setLogado(true)} />

  const renderPage = () => {
    if (page === "mec-os") return <MecanicoOSPage onNavigate={(k) => setPage(k as MecPg)} onLogout={() => navigate("/")} />
    return <div style={{ padding:"28px 32px" }}><EmConstrucao titulo={page} /></div>
  }

  return <>{renderPage()}</>
}

// ── PORTAL CLIENTE ──────────────────────────────────────────────
function PortalCliente() {
  const navigate = useNavigate()
  const [logado, setLogado] = useState(false)
  const [page, setPage] = useState<CliPg>("cli-dashboard")

  if (!logado) return <LoginSimples titulo="Portal Cliente" cor="#0d9488" tabela="clientes" camposBusca="email,telefone" onLogin={() => setLogado(true)} />

  const renderPage = () => {
    if (page === "cli-dashboard") return <ClienteDashboardPage onNavigate={(k) => setPage(k as CliPg)} onLogout={() => navigate("/")} />
    return <div style={{ padding:"28px 32px" }}><EmConstrucao titulo={page} /></div>
  }

  return <>{renderPage()}</>
}

// ── PORTAL DEV ──────────────────────────────────────────────────
function PortalDev() {
  const navigate = useNavigate()
  const [logado, setLogado] = useState(false)
  const [userName, setUserName] = useState("")
  const [page, setPage] = useState<DevPg>("dev-dashboard")

  if (!logado) return <LoginSimples titulo="Portal Developer" cor="#ef4444" tabela="colaboradores_portal_dev" onLogin={(user) => { setUserName(user.nome?.split(" ").slice(0,2).join(" ")); setLogado(true) }} />

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
    return <EmConstrucao titulo={page} />
  }

  return (
    <DevLayout activeKey={page} onNavigate={(k) => setPage(k as DevPg)} onLogout={() => navigate("/")} userName={userName}>
      {renderPage()}
    </DevLayout>
  )
}

// ── APP COM ROTAS ───────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelecionarPerfilRoute />} />
        <Route path="/consultor" element={<PortalConsultor />} />
        <Route path="/gestao" element={<PortalGestao />} />
        <Route path="/mecanico" element={<PortalMecanico />} />
        <Route path="/cliente" element={<PortalCliente />} />
        <Route path="/dev" element={<PortalDev />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
