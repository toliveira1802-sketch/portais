import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://acuufrgoyjwzlyhopaus.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const loginConsultor = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const { data: consultor, error: err } = await supabase
    .from("colaboradores_portal_consultor")
    .select("*")
    .eq("auth_user_id", data.user.id)
    .single()
  if (err || !consultor) throw new Error("Consultor nao encontrado")
  if (!consultor.ativo) throw new Error("Usuario inativo")
  const { data: company } = await supabase
    .from("companies")
    .select("nome, slug, cor_primaria, cidade, estado")
    .eq("id_companies", consultor.empresa_id)
    .single()
  await supabase.from("colaboradores_portal_consultor")
    .update({ ultimo_acesso: new Date().toISOString() })
    .eq("id", consultor.id)
  return { session: data.session, consultor: { ...consultor, companies: company } }
}

export const logoutConsultor = async () => { await supabase.auth.signOut() }

export const getClientes = async (empresa_id: string) => {
  const { data, error } = await supabase.from("clientes").select("*")
    .eq("id_companies", empresa_id).eq("ativo", true).order("nome")
  if (error) throw error
  return data
}

export const createCliente = async (cliente: any) => {
  const { data, error } = await supabase.from("clientes").insert(cliente).select().single()
  if (error) throw error
  return data
}

export const updateCliente = async (id: string, updates: any) => {
  const { data, error } = await supabase.from("clientes").update(updates).eq("id_cliente", id).select().single()
  if (error) throw error
  return data
}

export const getVeiculosByCliente = async (id_cliente: string) => {
  const { data, error } = await supabase.from("veiculos").select("*")
    .eq("id_cliente", id_cliente).eq("ativo", true).order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export const createVeiculo = async (veiculo: any) => {
  const { data, error } = await supabase.from("veiculos").insert(veiculo).select().single()
  if (error) throw error
  return data
}

export const getOrdensServico = async (empresa_id: string, filters?: { status?: string; consultor_id?: string }) => {
  let query = supabase.from("ordens_servico")
    .select("*, cliente:id_cliente(id_cliente,nome,telefone), veiculo:id_veiculo(id_veiculo,placa,marca,modelo)")
    .eq("id_companies", empresa_id).order("created_at", { ascending: false })
  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.consultor_id) query = query.eq("id_consultor", filters.consultor_id)
  const { data, error } = await query
  if (error) throw error
  return data
}

export const createOrdemServico = async (os: any) => {
  const { data, error } = await supabase.from("ordens_servico").insert(os).select().single()
  if (error) throw error
  return data
}

export const updateOrdemServico = async (id: string, updates: any) => {
  const { data, error } = await supabase.from("ordens_servico").update(updates).eq("id_os", id).select().single()
  if (error) throw error
  return data
}

export const getDashboardStats = async (empresa_id: string) => {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const hoje = new Date().toISOString().split("T")[0]
  const [a, b, c, d] = await Promise.all([
    supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
      .eq("id_companies", empresa_id).in("status", ["aberta","em_andamento","aguardando_peca","aguardando_aprovacao"]),
    supabase.from("ordens_servico").select("id_os", { count: "exact", head: true })
      .eq("id_companies", empresa_id).gte("data_entrada", hoje),
    supabase.from("clientes").select("id_cliente", { count: "exact", head: true })
      .eq("id_companies", empresa_id).gte("created_at", inicioMes),
    supabase.from("ordens_servico").select("valor_final")
      .eq("id_companies", empresa_id).eq("status", "entregue").gte("data_entrega", inicioMes)
  ])
  return {
    osAbertas: a.count || 0,
    osHoje: b.count || 0,
    clientesNoMes: c.count || 0,
    faturamentoMes: d.data?.reduce((acc: number, os: any) => acc + (os.valor_final || 0), 0) || 0
  }
}
