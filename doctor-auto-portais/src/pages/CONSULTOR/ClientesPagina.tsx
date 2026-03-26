import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getClientes } from "../lib/supabase"

const COR = "#1d4ed8"

export default function ClientesPagina() {
  const { consultor } = useAuth()
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")

  useEffect(() => {
    if (consultor?.empresa_id) {
      getClientes(consultor.empresa_id).then(data => { setClientes(data || []); setLoading(false) }).catch(() => setLoading(false))
    }
  }, [consultor])

  const filtrados = clientes.filter(c =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone?.includes(busca) ||
    c.cpf_cnpj?.includes(busca)
  )

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>Clientes</h2>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>{clientes.length} clientes cadastrados</p>
        </div>
        <button style={{
          padding: "10px 18px", background: COR, border: "none", borderRadius: "10px",
          color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit"
        }}>
          + Novo Cliente
        </button>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: "20px" }}>
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, telefone ou CPF/CNPJ..."
          style={{
            width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
            color: "#e4e4e7", fontSize: "14px", outline: "none", fontFamily: "inherit"
          }}
        />
      </div>

      {/* Tabela */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Carregando clientes...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👤</div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              {clientes.length === 0 ? "Nenhum cliente cadastrado ainda" : "Nenhum resultado encontrado"}
            </div>
            {clientes.length === 0 && (
              <p style={{ color: "#52525b", fontSize: "12px", marginTop: "6px" }}>Cadastre o primeiro cliente para comecar</p>
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nome", "Telefone", "CPF/CNPJ", "Cidade", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id_cliente} style={{ cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: COR, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                        {c.nome?.charAt(0)}
                      </div>
                      <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{c.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{c.telefone || "—"}</td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace" }}>{c.cpf_cnpj || "—"}</td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{c.cidade || "—"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "500", background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                      Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
