import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

type Colaborador = { id: string; nome: string; cargo: string; ativo: boolean; email: string; created_at: string; ultimo_acesso?: string; portal: string }

export default function GestaoRH() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroPortal, setFiltroPortal] = useState("todos")

  useEffect(() => { fetchEquipe() }, [])

  const fetchEquipe = async () => {
    try {
      const [consultores, mecanicos, gestores] = await Promise.all([
        supabase.from("colaboradores_portal_consultor").select("id, nome, cargo, ativo, email, created_at, ultimo_acesso").eq("empresa_id", EMPRESA_ID),
        supabase.from("colaboradores_portal_mecanico").select("id, nome, cargo, ativo, email, created_at, ultimo_acesso").eq("empresa_id", EMPRESA_ID),
        supabase.from("colaboradores_portal_gestao").select("id, nome, cargo, ativo, email, created_at, ultimo_acesso").eq("empresa_id", EMPRESA_ID),
      ])

      const todos: Colaborador[] = [
        ...(consultores.data || []).map((c: any) => ({ ...c, portal: "Consultor" })),
        ...(mecanicos.data || []).map((c: any) => ({ ...c, portal: "Mecanico" })),
        ...(gestores.data || []).map((c: any) => ({ ...c, portal: "Gestao" })),
      ]

      setColaboradores(todos.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const filtrados = filtroPortal === "todos" ? colaboradores : colaboradores.filter(c => c.portal === filtroPortal)
  const ativos = colaboradores.filter(c => c.ativo).length
  const inativos = colaboradores.filter(c => !c.ativo).length

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }

  const PORTAL_COR: Record<string, { color: string; bg: string }> = {
    Consultor: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    Mecanico: { color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
    Gestao: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  }

  const contPortal = colaboradores.reduce((acc, c) => { acc[c.portal] = (acc[c.portal] || 0) + 1; return acc }, {} as Record<string, number>)

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>RH - Equipe</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Gestao de colaboradores e equipe</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {[
          { label: "Total Equipe", value: String(colaboradores.length), icon: "👥", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
          { label: "Ativos", value: String(ativos), icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
          { label: "Inativos", value: String(inativos), icon: "⏸️", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
          { label: "Portais", value: String(Object.keys(contPortal).length), icon: "🏢", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
        ].map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: "14px", padding: "18px 20px" }}>
            <span style={{ fontSize: "20px" }}>{k.icon}</span>
            <div style={{ fontSize: "22px", fontWeight: "700", color: loading ? "#52525b" : k.color, marginTop: "8px" }}>{loading ? "..." : k.value}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px" }}>
        {["todos", "Consultor", "Mecanico", "Gestao"].map(f => (
          <button key={f} onClick={() => setFiltroPortal(f)} style={{
            padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
            background: filtroPortal === f ? "#7c3aed" : "rgba(255,255,255,0.05)", color: filtroPortal === f ? "#fff" : "#71717a", border: "none"
          }}>{f === "todos" ? `Todos (${colaboradores.length})` : `${f} (${contPortal[f] || 0})`}</button>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Nome", "Cargo", "Portal", "Email", "Status", "Ultimo Acesso"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#71717a", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>Carregando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>Nenhum colaborador encontrado</td></tr>
              ) : filtrados.map(c => {
                const pc = PORTAL_COR[c.portal] || { color: "#71717a", bg: "rgba(255,255,255,0.05)" }
                return (
                  <tr key={`${c.portal}-${c.id}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: pc.bg, display: "flex", alignItems: "center", justifyContent: "center", color: pc.color, fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                          {c.nome?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <span style={{ color: "#e4e4e7", fontWeight: "500" }}>{c.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#71717a" }}>{c.cargo || "—"}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" }}>{c.portal}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#52525b", fontSize: "12px" }}>{c.email}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.ativo ? "#22c55e" : "#52525b", display: "inline-block", marginRight: "6px" }} />
                      <span style={{ color: c.ativo ? "#22c55e" : "#52525b", fontSize: "12px" }}>{c.ativo ? "Ativo" : "Inativo"}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#52525b", fontSize: "12px" }}>
                      {c.ultimo_acesso ? new Date(c.ultimo_acesso).toLocaleDateString("pt-BR") : "Nunca"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
