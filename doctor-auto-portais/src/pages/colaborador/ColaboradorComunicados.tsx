import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const prioridadeConfig: Record<string, { label: string; cor: string; bg: string }> = {
  alta: { label: "Urgente", cor: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  media: { label: "Importante", cor: "#eab308", bg: "rgba(234,179,8,0.1)" },
  baixa: { label: "Informativo", cor: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
}

export default function ColaboradorComunicados({ user }: { user: any }) {
  const [comunicados, setComunicados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("comunicados")
          .select("*")
          .eq("ativo", true)
          .order("created_at", { ascending: false })
          .limit(20)

        setComunicados(data || [])
      } catch {
        // tabela pode nao existir
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Comunicados</h2>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Avisos e informacoes da empresa</p>
      </div>

      {loading ? (
        <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      ) : comunicados.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📢</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Nenhum comunicado</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>Comunicados da empresa aparecerão aqui</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {comunicados.map((c: any) => {
            const prio = prioridadeConfig[c.prioridade] || prioridadeConfig.baixa
            const dataFormatada = c.created_at
              ? new Date(c.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
              : ""
            return (
              <div key={c.id} style={{ ...cardStyle }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "6px", fontSize: "10px",
                      fontWeight: "700", background: prio.bg, color: prio.cor,
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      {prio.label}
                    </span>
                    {c.categoria && (
                      <span style={{ color: "#52525b", fontSize: "11px" }}>#{c.categoria}</span>
                    )}
                  </div>
                  <span style={{ color: "#52525b", fontSize: "11px" }}>{dataFormatada}</span>
                </div>
                <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", margin: "0 0 8px" }}>{c.titulo}</h3>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{c.conteudo}</p>
                {c.autor && (
                  <div style={{ marginTop: "12px", color: "#52525b", fontSize: "11px" }}>— {c.autor}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
