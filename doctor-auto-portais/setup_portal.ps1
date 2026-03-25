# ============================================================
# DOCTOR AUTO - Setup Portal Consultor
# Rode dentro de: C:\Users\docto\Documents\doctor-auto-portais
# ============================================================

# .env
@'
VITE_SUPABASE_URL=https://acuufrgoyjwzlyhopaus.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_SUA_ANON_KEY_AQUI
'@ | Set-Content .env

# src/types/consultor.ts
@'
export interface Consultor {
  id: string
  auth_user_id: string | null
  empresa_id: string
  nome: string
  email: string
  telefone?: string
  cargo: string
  ativo: boolean
  primeiro_acesso: boolean
  username?: string
  ultimo_acesso?: string
  created_at: string
}

export interface Cliente {
  id: string
  empresa_id: string
  consultor_id?: string
  nome: string
  telefone?: string
  email?: string
  cpf?: string
  data_nascimento?: string
  cep?: string
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  observacoes?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Veiculo {
  id: string
  empresa_id: string
  cliente_id: string
  placa: string
  marca?: string
  modelo?: string
  ano_fabricacao?: number
  cor?: string
  combustivel?: string
  km_atual?: number
  ativo: boolean
  created_at: string
  cliente?: Cliente
}

export type OSStatus = 'aberta' | 'em_andamento' | 'aguardando_pecas' | 'pronta' | 'entregue' | 'cancelada'

export interface OrdemServico {
  id: string
  empresa_id: string
  numero_os: string
  cliente_id: string
  veiculo_id: string
  consultor_id?: string
  status: OSStatus
  km_entrada?: number
  descricao_problema?: string
  valor_mao_obra: number
  valor_pecas: number
  valor_total: number
  desconto: number
  forma_pagamento?: string
  data_previsao?: string
  data_abertura: string
  data_fechamento?: string
  observacoes?: string
  created_at: string
  cliente?: Cliente
  veiculo?: Veiculo
}
'@ | Set-Content src\types\consultor.ts

# src/lib/supabase.ts
@'
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const loginConsultor = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  const { data: consultor, error: errConsultor } = await supabase
    .from("colaboradores_portal_consultor")
    .select("*, companies:empresa_id(nome, slug, cor_primaria, logo_url, cidade, estado)")
    .eq("auth_user_id", data.user.id)
    .single()

  if (errConsultor || !consultor) throw new Error("Consultor não encontrado")
  if (!consultor.ativo) throw new Error("Usuário inativo")

  await supabase
    .from("colaboradores_portal_consultor")
    .update({ ultimo_acesso: new Date().toISOString() })
    .eq("id", consultor.id)

  return { session: data.session, consultor }
}

export const logoutConsultor = async () => {
  await supabase.auth.signOut()
}

export const getClientes = async (empresa_id: string) => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("empresa_id", empresa_id)
    .eq("ativo", true)
    .order("nome")
  if (error) throw error
  return data
}

export const createCliente = async (cliente: any) => {
  const { data, error } = await supabase.from("clientes").insert(cliente).select().single()
  if (error) throw error
  return data
}

export const updateCliente = async (id: string, updates: any) => {
  const { data, error } = await supabase.from("clientes").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

export const getVeiculosByCliente = async (cliente_id: string) => {
  const { data, error } = await supabase
    .from("veiculos")
    .select("*")
    .eq("cliente_id", cliente_id)
    .eq("ativo", true)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export const createVeiculo = async (veiculo: any) => {
  const { data, error } = await supabase.from("veiculos").insert(veiculo).select().single()
  if (error) throw error
  return data
}

export const getOrdensServico = async (empresa_id: string, filters?: { status?: string; consultor_id?: string }) => {
  let query = supabase
    .from("ordens_servico")
    .select("*, cliente:cliente_id(id, nome, telefone), veiculo:veiculo_id(id, placa, marca, modelo)")
    .eq("empresa_id", empresa_id)
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.consultor_id) query = query.eq("consultor_id", filters.consultor_id)

  const { data, error } = await query
  if (error) throw error
  return data
}

export const createOrdemServico = async (os: any) => {
  const { data: numeroData, error: numErr } = await supabase.rpc("gerar_numero_os", { p_empresa_id: os.empresa_id })
  if (numErr) throw numErr

  const { data, error } = await supabase
    .from("ordens_servico")
    .insert({ ...os, numero_os: numeroData })
    .select()
    .single()
  if (error) throw error
  return data
}

export const updateOrdemServico = async (id: string, updates: any) => {
  const { data, error } = await supabase.from("ordens_servico").update(updates).eq("id", id).select().single()
  if (error) throw error
  return data
}

export const getDashboardStats = async (empresa_id: string) => {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const hoje = new Date().toISOString().split("T")[0]

  const [osAberta, osHoje, clientesMes, faturamento] = await Promise.all([
    supabase.from("ordens_servico").select("id", { count: "exact", head: true }).eq("empresa_id", empresa_id).in("status", ["aberta", "em_andamento", "aguardando_pecas"]),
    supabase.from("ordens_servico").select("id", { count: "exact", head: true }).eq("empresa_id", empresa_id).gte("data_abertura", hoje),
    supabase.from("clientes").select("id", { count: "exact", head: true }).eq("empresa_id", empresa_id).gte("created_at", inicioMes),
    supabase.from("ordens_servico").select("valor_total").eq("empresa_id", empresa_id).eq("status", "entregue").gte("data_fechamento", inicioMes)
  ])

  const totalFaturamento = faturamento.data?.reduce((acc: number, os: any) => acc + (os.valor_total || 0), 0) || 0

  return {
    osAbertas: osAberta.count || 0,
    osHoje: osHoje.count || 0,
    clientesNoMes: clientesMes.count || 0,
    faturamentoMes: totalFaturamento
  }
}
'@ | Set-Content src\lib\supabase.ts

# src/contexts/AuthContext.tsx
@'
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase, loginConsultor, logoutConsultor } from "../lib/supabase"

interface AuthState {
  consultor: any | null
  company: any | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ consultor: null, company: null, loading: true })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const { data: consultor } = await supabase
            .from("colaboradores_portal_consultor")
            .select("*, companies:empresa_id(nome, slug, cor_primaria, logo_url, cidade, estado)")
            .eq("auth_user_id", session.user.id)
            .single()
          if (consultor) {
            setState({ consultor, company: consultor.companies, loading: false })
            return
          }
        } catch {}
      }
      setState(s => ({ ...s, loading: false }))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") setState({ consultor: null, company: null, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { consultor } = await loginConsultor(email, password)
    setState({ consultor, company: (consultor as any).companies, loading: false })
  }

  const logout = async () => {
    await logoutConsultor()
    setState({ consultor: null, company: null, loading: false })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth fora do AuthProvider")
  return ctx
}
'@ | Set-Content src\contexts\AuthContext.tsx

# src/pages/LoginConsultor.tsx
@'
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function LoginConsultor() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans, sans-serif", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -20%, rgba(220,38,38,0.15), transparent)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, opacity:0.03, backgroundImage:"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:"420px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"12px 24px", marginBottom:"24px" }}>
            <div style={{ width:"36px", height:"36px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:"900", color:"#fff" }}>DA</div>
            <div>
              <div style={{ color:"#fff", fontWeight:"700", fontSize:"15px" }}>DOCTOR AUTO</div>
              <div style={{ color:"#666", fontSize:"11px", letterSpacing:"2px" }}>PORTAL CONSULTOR</div>
            </div>
          </div>
          <h1 style={{ color:"#fff", fontSize:"28px", fontWeight:"700", margin:"0 0 8px", letterSpacing:"-0.5px" }}>Bem-vindo de volta</h1>
          <p style={{ color:"#555", margin:0, fontSize:"15px" }}>Acesse sua conta para continuar</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px", padding:"36px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:"20px" }}>
              <label style={{ display:"block", color:"#888", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@doctorauto.com" required
                style={{ width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#fff", fontSize:"15px", outline:"none", boxSizing:"border-box" }} />
            </div>
            <div style={{ marginBottom:"28px" }}>
              <label style={{ display:"block", color:"#888", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#fff", fontSize:"15px", outline:"none", boxSizing:"border-box" }} />
            </div>
            {error && <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:"10px", padding:"12px 16px", color:"#fca5a5", fontSize:"14px", marginBottom:"20px" }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"15px", background:loading?"rgba(220,38,38,0.5)":"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:"12px", color:"#fff", fontSize:"15px", fontWeight:"700", cursor:loading?"not-allowed":"pointer", boxShadow:loading?"none":"0 4px 24px rgba(220,38,38,0.3)", fontFamily:"inherit" }}>
              {loading ? "Entrando..." : "Entrar no Portal"}
            </button>
          </form>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap'); * { box-sizing:border-box; } input::placeholder { color:#444; }`}</style>
    </div>
  )
}
'@ | Set-Content src\pages\LoginConsultor.tsx

# src/components/ConsultorLayout.tsx
@'
import { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"

const navItems = [
  { icon:"⬡", label:"Dashboard", key:"dashboard" },
  { icon:"📋", label:"Ordens de Serviço", key:"ordens" },
  { icon:"👤", label:"Clientes", key:"clientes" },
  { icon:"🚗", label:"Veículos", key:"veiculos" },
]

interface Props {
  children: ReactNode
  activeKey: string
  onNavigate: (key: string) => void
}

export default function ConsultorLayout({ children, activeKey, onNavigate }: Props) {
  const { consultor, company, logout } = useAuth()
  const initials = consultor?.nome ? consultor.nome.split(" ").slice(0,2).map((n:string) => n[0]).join("") : "C"

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0d0d0d", fontFamily:"DM Sans, sans-serif", color:"#e8e8e8" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; } button { font-family:inherit; }`}</style>
      <aside style={{ width:"240px", minHeight:"100vh", background:"#111", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0, zIndex:100 }}>
        <div style={{ padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", background:"linear-gradient(135deg,#dc2626,#991b1b)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"13px" }}>{company?.nome || "DOCTOR AUTO"}</div>
            <div style={{ color:"#555", fontSize:"11px", letterSpacing:"1px" }}>CONSULTOR</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"16px 10px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {navItems.map(item => {
            const active = activeKey === item.key
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)}
                style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"10px", background:active?"rgba(220,38,38,0.12)":"transparent", border:active?"1px solid rgba(220,38,38,0.2)":"1px solid transparent", color:active?"#f87171":"#666", cursor:"pointer", textAlign:"left", fontSize:"14px", fontWeight:active?"600":"400", width:"100%" }}>
                <span style={{ fontSize:"16px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"linear-gradient(135deg,#dc2626,#7f1d1d)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"13px", fontWeight:"700", flexShrink:0 }}>{initials}</div>
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ color:"#ccc", fontSize:"13px", fontWeight:"500", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{consultor?.nome?.split(" ")[0]}</div>
            <div style={{ color:"#444", fontSize:"11px" }}>Consultor</div>
          </div>
          <button onClick={logout} title="Sair" style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", padding:"6px 8px", color:"#555", cursor:"pointer", fontSize:"14px" }}>↩</button>
        </div>
      </aside>
      <main style={{ flex:1, marginLeft:"240px", display:"flex", flexDirection:"column" }}>
        <header style={{ padding:"20px 32px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"#0d0d0d", position:"sticky", top:0, zIndex:50 }}>
          <h1 style={{ fontSize:"20px", fontWeight:"700", color:"#fff" }}>
            {navItems.find(n => n.key === activeKey)?.label}
          </h1>
        </header>
        <div style={{ flex:1, padding:"28px 32px" }}>{children}</div>
      </main>
    </div>
  )
}

export function BtnPrimary({ onClick, children, disabled }: { onClick?: () => void, children: ReactNode, disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding:"11px 20px", background:disabled?"rgba(220,38,38,0.3)":"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:"10px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:disabled?"not-allowed":"pointer", boxShadow:disabled?"none":"0 2px 12px rgba(220,38,38,0.2)", whiteSpace:"nowrap" }}>
      {children}
    </button>
  )
}

export function BtnSecondary({ onClick, children }: { onClick?: () => void, children: ReactNode }) {
  return (
    <button onClick={onClick}
      style={{ padding:"11px 20px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", color:"#aaa", fontSize:"14px", fontWeight:"500", cursor:"pointer", whiteSpace:"nowrap" }}>
      {children}
    </button>
  )
}
'@ | Set-Content src\components\ConsultorLayout.tsx

# src/pages/DashboardConsultor.tsx
@'
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getDashboardStats, getOrdensServico } from "../lib/supabase"

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  aberta: { label:"Aberta", color:"#60a5fa", bg:"rgba(96,165,250,0.1)" },
  em_andamento: { label:"Em andamento", color:"#fb923c", bg:"rgba(251,146,60,0.1)" },
  aguardando_pecas: { label:"Aguardando peças", color:"#facc15", bg:"rgba(250,204,21,0.1)" },
  pronta: { label:"Pronta", color:"#4ade80", bg:"rgba(74,222,128,0.1)" },
  entregue: { label:"Entregue", color:"#a3e635", bg:"rgba(163,230,53,0.1)" },
  cancelada: { label:"Cancelada", color:"#f87171", bg:"rgba(248,113,113,0.1)" },
}

export default function DashboardConsultor() {
  const { consultor, company } = useAuth()
  const [stats, setStats] = useState({ osAbertas:0, osHoje:0, clientesNoMes:0, faturamentoMes:0 })
  const [osRecentes, setOsRecentes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (consultor?.empresa_id) loadData() }, [consultor])

  const loadData = async () => {
    try {
      const [s, os] = await Promise.all([
        getDashboardStats(consultor!.empresa_id),
        getOrdensServico(consultor!.empresa_id, { consultor_id: consultor!.id })
      ])
      setStats(s)
      setOsRecentes((os as any[]).slice(0, 8))
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite"

  const cards = [
    { label:"OS Abertas", value:stats.osAbertas, icon:"📋", color:"#fb923c" },
    { label:"OS Hoje", value:stats.osHoje, icon:"📅", color:"#60a5fa" },
    { label:"Novos Clientes", value:stats.clientesNoMes, icon:"👥", color:"#4ade80" },
    { label:"Faturamento Mês", value:stats.faturamentoMes.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}), icon:"💰", color:"#facc15" },
  ]

  return (
    <div>
      <div style={{ marginBottom:"28px" }}>
        <p style={{ color:"#555", fontSize:"14px", marginBottom:"4px" }}>{saudacao}, {consultor?.nome?.split(" ")[0]} 👋</p>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <p style={{ color:"#888", fontSize:"14px", margin:0 }}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
          {company && <span style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"99px", padding:"2px 10px", fontSize:"12px", color:"#666" }}>{company.nome}</span>}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"32px" }}>
        {cards.map((card,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
              <span style={{ fontSize:"22px" }}>{card.icon}</span>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:card.color, boxShadow:`0 0 6px ${card.color}` }} />
            </div>
            <div style={{ fontSize:"26px", fontWeight:"700", color:"#fff", marginBottom:"4px" }}>{loading ? "..." : card.value}</div>
            <div style={{ fontSize:"13px", color:"#555" }}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", overflow:"hidden" }}>
        <div style={{ padding:"18px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between" }}>
          <h2 style={{ fontSize:"15px", fontWeight:"600", color:"#ccc" }}>Minhas OS Recentes</h2>
          <span style={{ color:"#444", fontSize:"12px" }}>{osRecentes.length} registros</span>
        </div>
        {loading ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#444" }}>Carregando...</div>
        ) : osRecentes.length === 0 ? (
          <div style={{ padding:"48px", textAlign:"center" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>📭</div>
            <div style={{ color:"#555" }}>Nenhuma OS ainda</div>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>{["Nº OS","Cliente","Veículo","Status","Valor","Data"].map(col => (
                <th key={col} style={{ padding:"12px 24px", textAlign:"left", color:"#3a3a3a", fontSize:"11px", letterSpacing:"1px", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,0.04)", fontWeight:"500" }}>{col}</th>
              ))}</tr>
            </thead>
            <tbody>
              {osRecentes.map((os,i) => {
                const sc = STATUS_CONFIG[os.status] || STATUS_CONFIG.aberta
                return (
                  <tr key={os.id} style={{ borderBottom: i < osRecentes.length-1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <td style={{ padding:"14px 24px", color:"#f87171", fontWeight:"600" }}>{os.numero_os}</td>
                    <td style={{ padding:"14px 24px", color:"#ccc", fontSize:"14px" }}>{os.cliente?.nome || "—"}</td>
                    <td style={{ padding:"14px 24px", color:"#888", fontSize:"13px" }}>{os.veiculo ? `${os.veiculo.placa} · ${os.veiculo.modelo||""}`.trim() : "—"}</td>
                    <td style={{ padding:"14px 24px" }}><span style={{ background:sc.bg, color:sc.color, padding:"4px 10px", borderRadius:"99px", fontSize:"12px", fontWeight:"500" }}>{sc.label}</span></td>
                    <td style={{ padding:"14px 24px", color:"#ccc", fontSize:"14px" }}>{os.valor_total ? os.valor_total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}) : "—"}</td>
                    <td style={{ padding:"14px 24px", color:"#555", fontSize:"13px" }}>{new Date(os.data_abertura).toLocaleDateString("pt-BR")}</td>
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
'@ | Set-Content src\pages\DashboardConsultor.tsx

# src/App.tsx
@'
import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import LoginConsultor from "./pages/LoginConsultor"
import ConsultorLayout from "./components/ConsultorLayout"
import DashboardConsultor from "./pages/DashboardConsultor"

function PortalConsultor() {
  const { consultor, loading } = useAuth()
  const [page, setPage] = useState("dashboard")

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", color:"#444", fontFamily:"sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"28px", height:"28px", border:"2px solid rgba(220,38,38,0.3)", borderTop:"2px solid #dc2626", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Carregando...
      </div>
    </div>
  )

  if (!consultor) return <LoginConsultor />

  return (
    <ConsultorLayout activeKey={page} onNavigate={setPage}>
      {page === "dashboard" && <DashboardConsultor />}
      {page === "ordens" && <div style={{ color:"#555", padding:"40px", textAlign:"center" }}>Página de OS — em breve</div>}
      {page === "clientes" && <div style={{ color:"#555", padding:"40px", textAlign:"center" }}>Página de Clientes — em breve</div>}
      {page === "veiculos" && <div style={{ color:"#555", padding:"40px", textAlign:"center" }}>Página de Veículos — em breve</div>}
    </ConsultorLayout>
  )
}

export default function App() {
  return <AuthProvider><PortalConsultor /></AuthProvider>
}
'@ | Set-Content src\App.tsx

Write-Host ""
Write-Host "✅ Arquivos criados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Abra o arquivo .env e cole sua ANON KEY do Supabase" -ForegroundColor Yellow
Write-Host "   Supabase Dashboard → Project Settings → API → anon public" -ForegroundColor Yellow
Write-Host ""
Write-Host "▶️  Para rodar: npm run dev" -ForegroundColor Cyan
