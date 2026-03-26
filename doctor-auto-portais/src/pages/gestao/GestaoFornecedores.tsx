import { useState } from "react"

type Fornecedor = { id: number; nome: string; tipo: string; contato: string; telefone: string; avaliacao: number; status: "ativo" | "inativo" }

const FORNECEDORES: Fornecedor[] = [
  { id: 1, nome: "Auto Pecas Brasil", tipo: "Pecas", contato: "Carlos Silva", telefone: "(11) 99999-1111", avaliacao: 4.5, status: "ativo" },
  { id: 2, nome: "Distribuidora Motor+", tipo: "Lubrificantes", contato: "Ana Costa", telefone: "(11) 99999-2222", avaliacao: 4.2, status: "ativo" },
  { id: 3, nome: "Tintas AutoColor", tipo: "Pintura", contato: "Roberto Lima", telefone: "(11) 99999-3333", avaliacao: 3.8, status: "ativo" },
  { id: 4, nome: "Eletro Auto SP", tipo: "Eletrica", contato: "Marcos Souza", telefone: "(11) 99999-4444", avaliacao: 4.0, status: "ativo" },
  { id: 5, nome: "Borrachas Center", tipo: "Borracharia", contato: "Jose Santos", telefone: "(11) 99999-5555", avaliacao: 3.5, status: "inativo" },
  { id: 6, nome: "Freios Premium", tipo: "Freios", contato: "Paula Rocha", telefone: "(11) 99999-6666", avaliacao: 4.8, status: "ativo" },
]

export default function GestaoFornecedores() {
  const [fornecedores] = useState<Fornecedor[]>(FORNECEDORES)
  const [busca, setBusca] = useState("")

  const filtrados = busca ? fornecedores.filter(f => f.nome.toLowerCase().includes(busca.toLowerCase()) || f.tipo.toLowerCase().includes(busca.toLowerCase())) : fornecedores
  const ativos = fornecedores.filter(f => f.status === "ativo").length

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }
  const inp: React.CSSProperties = { padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit" }

  const renderStars = (n: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(n) ? "#fbbf24" : "#27272a", fontSize: "12px" }}>★</span>
    ))
  }

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Fornecedores</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Gestao de fornecedores e parceiros</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>{ativos} ativos</span>
          <span style={{ background: "rgba(255,255,255,0.05)", color: "#71717a", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>{fornecedores.length} total</span>
        </div>
      </div>

      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar fornecedor ou tipo..." style={{ ...inp, maxWidth: "400px", boxSizing: "border-box" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>
        {filtrados.map(f => (
          <div key={f.id} style={{ ...card, opacity: f.status === "inativo" ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px" }}>{f.nome}</h3>
                <span style={{ color: "#52525b", fontSize: "12px" }}>{f.tipo}</span>
              </div>
              <span style={{
                background: f.status === "ativo" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                color: f.status === "ativo" ? "#22c55e" : "#52525b",
                padding: "2px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: "700"
              }}>{f.status === "ativo" ? "ATIVO" : "INATIVO"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#71717a", fontSize: "12px" }}>Contato: {f.contato}</span>
              </div>
              <span style={{ color: "#71717a", fontSize: "12px" }}>{f.telefone}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                {renderStars(f.avaliacao)}
                <span style={{ color: "#71717a", fontSize: "11px", marginLeft: "4px" }}>{f.avaliacao}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...card, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <div>
            <div style={{ color: "#a78bfa", fontWeight: "600", fontSize: "13px" }}>Em breve</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>Cadastro de fornecedores integrado ao Supabase com historico de compras e avaliacoes automaticas.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
