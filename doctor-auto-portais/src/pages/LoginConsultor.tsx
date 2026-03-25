import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function LoginConsultor({ onBack }: { onBack?: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    try { await login(email, password) }
    catch (err: any) { setError(err.message || "Erro ao fazer login") }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -20%, rgba(220,38,38,0.15), transparent)", pointerEvents:"none" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:"420px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"12px 24px", marginBottom:"20px" }}>
            <div style={{ width:"36px", height:"36px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", color:"#fff", fontSize:"13px" }}>DA</div>
            <div>
              <div style={{ color:"#fff", fontWeight:"700", fontSize:"15px" }}>DOCTOR AUTO</div>
              <div style={{ color:"#666", fontSize:"11px", letterSpacing:"2px" }}>PORTAL CONSULTOR</div>
            </div>
          </div>
          <h1 style={{ color:"#fff", fontSize:"26px", fontWeight:"700", margin:"0 0 8px" }}>Bem-vindo de volta</h1>
          <p style={{ color:"#555", margin:0 }}>Acesse sua conta para continuar</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", padding:"32px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", color:"#888", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@doctorauto.com" required
                style={{ width:"100%", padding:"13px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#fff", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
            <div style={{ marginBottom:"24px" }}>
              <label style={{ display:"block", color:"#888", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width:"100%", padding:"13px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#fff", fontSize:"14px", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            </div>
            {error && <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:"10px", padding:"12px", color:"#fca5a5", fontSize:"14px", marginBottom:"16px" }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"14px", background:loading?"rgba(220,38,38,0.4)":"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:"10px", color:"#fff", fontSize:"15px", fontWeight:"700", cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
              {loading ? "Entrando..." : "Entrar no Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
