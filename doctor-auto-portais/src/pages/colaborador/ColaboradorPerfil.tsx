import { useState } from "react"

export default function ColaboradorPerfil({ user }: { user: any }) {
  const [tab, setTab] = useState<"info" | "documentos">("info")

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  const fieldStyle: React.CSSProperties = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  }

  const campos = [
    { label: "Nome Completo", valor: user.nome },
    { label: "Email", valor: user.email },
    { label: "Telefone", valor: user.telefone },
    { label: "Cargo", valor: user.cargo },
    { label: "Setor", valor: user.setor },
    { label: "Data Admissao", valor: user.data_admissao ? new Date(user.data_admissao).toLocaleDateString("pt-BR") : null },
    { label: "CPF", valor: user.cpf },
    { label: "Status", valor: user.ativo ? "Ativo" : "Inativo" },
  ].filter(c => c.valor)

  return (
    <div>
      {/* Header do perfil */}
      <div style={{ ...cardStyle, marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "16px",
          background: "linear-gradient(135deg, #0891b2, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", fontWeight: "700", color: "#fff", flexShrink: 0,
        }}>
          {(user.nome || "C")[0].toUpperCase()}
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{user.nome}</div>
          <div style={{ color: "#71717a", fontSize: "13px", marginTop: "2px" }}>{user.cargo || "Colaborador"}</div>
          <div style={{ marginTop: "8px", display: "inline-flex", padding: "3px 12px", borderRadius: "6px", background: user.ativo !== false ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${user.ativo !== false ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
            <span style={{ color: user.ativo !== false ? "#22c55e" : "#ef4444", fontSize: "11px", fontWeight: "600" }}>
              {user.ativo !== false ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
        {(["info", "documentos"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
            background: tab === t ? "#0891b2" : "rgba(255,255,255,0.05)",
            color: tab === t ? "#fff" : "#9ca3af",
            fontSize: "13px", fontWeight: "600", fontFamily: "inherit", textTransform: "capitalize",
          }}>
            {t === "info" ? "Informacoes" : "Documentos"}
          </button>
        ))}
      </div>

      {tab === "info" ? (
        <div style={cardStyle}>
          <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "8px" }}>Dados Pessoais</h3>
          {campos.map((c, i) => (
            <div key={i} style={fieldStyle}>
              <span style={{ color: "#71717a", fontSize: "12px", fontWeight: "500" }}>{c.label}</span>
              <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{c.valor}</span>
            </div>
          ))}
          {user.ultimo_acesso && (
            <div style={{ marginTop: "16px", color: "#52525b", fontSize: "11px" }}>
              Ultimo acesso: {new Date(user.ultimo_acesso).toLocaleString("pt-BR")}
            </div>
          )}
        </div>
      ) : (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📁</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Documentos</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>Seus documentos e contratos aparecerao aqui</div>
        </div>
      )}
    </div>
  )
}
