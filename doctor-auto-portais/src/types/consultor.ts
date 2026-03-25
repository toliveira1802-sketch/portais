export interface Consultor {
  id: string
  auth_user_id: string | null
  empresa_id: string
  nome: string
  email: string
  cargo: string
  ativo: boolean
  primeiro_acesso: boolean
  username?: string
  created_at: string
}

export interface Cliente {
  id_cliente: string
  id_companies: string
  created_by?: string
  nome: string
  telefone?: string
  email?: string
  cpf_cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  observacoes?: string
  origem: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Veiculo {
  id_veiculo: string
  id_cliente: string
  id_companies: string
  placa: string
  marca?: string
  modelo?: string
  ano?: number
  ano_modelo?: number
  cor?: string
  chassi?: string
  km_atual?: number
  observacoes?: string
  ativo: boolean
  created_at: string
}

export type OSStatus = 'aberta' | 'em_andamento' | 'aguardando_peca' | 'aguardando_aprovacao' | 'finalizada' | 'entregue' | 'cancelada'

export interface OrdemServico {
  id_os: string
  numero_os: number
  id_companies: string
  id_cliente: string
  id_veiculo: string
  id_consultor?: string
  id_mecanico?: string
  status: OSStatus
  km_entrada?: number
  reclamacao_cliente?: string
  diagnostico?: string
  observacoes_internas?: string
  valor_total: number
  valor_desconto: number
  valor_final: number
  forma_pagamento?: string
  data_entrada: string
  data_previsao?: string
  data_conclusao?: string
  data_entrega?: string
  prioridade: string
  created_at: string
  cliente?: Cliente
  veiculo?: Veiculo
}
