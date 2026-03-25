import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COR = "#10b981"

interface Colaborador {
  id: string
  nome: string
  email: string
  cargo: string
  ativo: boolean
  ultimo_acesso: string | null
  username?: string
}

type PortalTab = "consultor" | "gestao" | "mecanico" | "dev"

const portais: { key: PortalTab; label: string; tabela: string; cor: string }[] = [
  { key: "consultor", label: "Consultores", tabela: "colaboradores_portal_consultor", cor: "#1d4ed8" },
  { key: "gestao", label: "Gestao", tabela: "colaboradores_portal_gestao", cor: "#7c3aed" },
  { key: "mecanico", label: "Mecanicos", tabela: "colaboradores_portal_mecanico", cor: "#ea580c" },
  { key: "dev", label: "Developers", tabela: "colaboradores_portal_dev", cor: "#10b981" },
]

export default function DevUsuarios() {
  const [tab, setTab] = useState<PortalTab>("consultor")
  const [usuarios, setUsuarios] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsuarios()
  }, [tab])

  const fetchUsuarios = async () => {
    setLoading(true)
    const tabela = portais.find(p => p.key === tab)!.tabela
    const { data, error } = await supabase.from(tabela).select("*").order("nome")
    if (!error && data) setUsuarios(data)
    setLoading(false)
  }

  const toggleAtivo = async (id: string, ativo: boolean) => {
    const tabela = portais.find(p => p.key === tab)!.tabela
    await supabase.from(tabela).update({ ativo: !ativo }).eq("id", id)
    fetchUsuarios()
  }

  const portalAtual = portais.find(p => p.key === tab)!

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>Gerenciar Usuarios</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Visualize e gerencie colaboradores de todos os portais</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {portais.map(p => (
          <button key={p.key} onClick={() => setTab(p.key)} style={{
            padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            background: tab === p.key ? p.cor : "rgba(255,255,255,0.05)",
            border: tab === p.key ? "none" : "1px solid rgba(255,255,255,0.1)",
            color: tab === p.key ? "#fff" : "#9ca3af"
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Contagem */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ ...cardStyle, padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{usuarios.length}</span>
          <span style={{ color: "#6b7280", fontSize: "13px" }}>total</span>
        </div>
        <div style={{ ...cardStyle, padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
          <span style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{usuarios.filter(u => u.ativo).length}</span>
          <span style={{ color: "#6b7280", fontSize: "13px" }}>ativos</span>
        </div>
        <div style={{ ...cardStyle, padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
          <span style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{usuarios.filter(u => !u.ativo).length}</span>
          <span style={{ color: "#6b7280", fontSize: "13px" }}>inativos</span>
        </div>
      </div>

      {/* Tabela */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Carregando...</div>
        ) : usuarios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#52525b" }}>Nenhum usuario encontrado</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nome", "Email", "Cargo", "Status", "Ultimo Acesso", "Acoes"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: portalAtual.cor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "700" }}>
                        {u.nome?.charAt(0)}
                      </div>
                      <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{u.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{u.email}</td>
                  <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{u.cargo}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "500",
                      background: u.ativo ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      color: u.ativo ? "#10b981" : "#ef4444"
                    }}>
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#6b7280", fontSize: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    {u.ultimo_acesso ? new Date(u.ultimo_acesso).toLocaleDateString("pt-BR") : "Nunca"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <button onClick={() => toggleAtivo(u.id, u.ativo)} style={{
                      padding: "4px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit",
                      background: u.ativo ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                      border: "none",
                      color: u.ativo ? "#ef4444" : "#10b981"
                    }}>
                      {u.ativo ? "Desativar" : "Ativar"}
                    </button>
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
