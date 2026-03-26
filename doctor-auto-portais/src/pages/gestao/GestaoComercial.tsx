import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

export default function GestaoComercial() {
  const [stats, setStats] = useState({ totalClientes: 0, clientesMes: 0, origens: [] as { origem: string; qtd: number }[], recorrentes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchComercial() }, [])

  const fetchComercial = async () => {
    try {
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

      const [totalRes, mesRes, origensRes, osRes] = await Promise.all([
        supabase.from("clientes").select("id_cliente", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).eq("ativo", true),
        supabase.from("clientes").select("id_cliente", { count: "exact", head: true }).eq("id_companies", EMPRESA_ID).gte("created_at", inicioMes),
        supabase.from("clientes").select("origem").eq("id_companies", EMPRESA_ID).eq("ativo", true),
        supabase.from("ordens_servico").select("id_cliente").eq("id_companies", EMPRESA_ID),
      ])

      // Contar origens
      const origMap: Record<string, number> = {}
      origensRes.data?.forEach((c: any) => {
        const o = c.origem || "Nao informado"
        origMap[o] = (origMap[o] || 0) + 1
      })
      const origens = Object.entries(origMap).sort(([, a], [, b]) => b - a).map(([origem, qtd]) => ({ origem, qtd }))

      // Clientes recorrentes (mais de 1 OS)
      const osMap: Record<string, number> = {}
      osRes.data?.forEach((os: any) => { osMap[os.id_cliente] = (osMap[os.id_cliente] || 0) + 1 })
      const recorrentes = Object.values(osMap).filter(v => v > 1).length

      setStats({ totalClientes: totalRes.count || 0, clientesMes: mesRes.count || 0, origens, recorrentes })
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }
  const maxOrigem = Math.max(...stats.origens.map(o => o.qtd), 1)

  const kpis = [
    { label: "Total Clientes", value: String(stats.totalClientes), icon: "👥", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    { label: "Novos no Mes", value: String(stats.clientesMes), icon: "🆕", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
    { label: "Recorrentes", value: String(stats.recorrentes), icon: "🔄", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
    { label: "Taxa Retorno", value: stats.totalClientes > 0 ? `${((stats.recorrentes / stats.totalClientes) * 100).toFixed(0)}%` : "0%", icon: "📊", color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  ]

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Comercial</h1>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Captacao, retencao e origem de clientes</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: "14px", padding: "18px 20px" }}>
            <span style={{ fontSize: "20px" }}>{k.icon}</span>
            <div style={{ fontSize: "22px", fontWeight: "700", color: loading ? "#52525b" : k.color, marginTop: "8px" }}>{loading ? "..." : k.value}</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Origens */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>Origem dos Clientes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats.origens.map((o, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#e4e4e7", fontSize: "13px", textTransform: "capitalize" }}>{o.origem}</span>
                  <span style={{ color: "#71717a", fontSize: "12px" }}>{o.qtd}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${(o.qtd / maxOrigem) * 100}%`, height: "100%", background: "#7c3aed", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
            {stats.origens.length === 0 && !loading && <div style={{ color: "#52525b", fontSize: "13px", textAlign: "center", padding: "20px" }}>Sem dados</div>}
          </div>
        </div>

        {/* Insights */}
        <div style={{ ...card }}>
          <h3 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "16px" }}>Insights Comerciais</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: "📈", msg: `${stats.clientesMes} novos clientes captados este mes`, tipo: stats.clientesMes > 5 ? "success" : "warning" },
              { icon: "🔄", msg: `${stats.recorrentes} clientes retornaram para mais servicos`, tipo: "info" },
              { icon: "🎯", msg: stats.origens[0] ? `Principal canal: ${stats.origens[0].origem} (${stats.origens[0].qtd} clientes)` : "Sem dados de origem", tipo: "info" },
            ].map((ins, i) => (
              <div key={i} style={{
                padding: "12px 14px", borderRadius: "10px", fontSize: "13px", display: "flex", alignItems: "center", gap: "10px",
                background: ins.tipo === "success" ? "rgba(34,197,94,0.06)" : ins.tipo === "warning" ? "rgba(251,191,36,0.06)" : "rgba(96,165,250,0.06)",
                border: `1px solid ${ins.tipo === "success" ? "rgba(34,197,94,0.15)" : ins.tipo === "warning" ? "rgba(251,191,36,0.15)" : "rgba(96,165,250,0.15)"}`,
                color: "#d4d4d8"
              }}>
                <span style={{ fontSize: "16px" }}>{ins.icon}</span>
                <span>{ins.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
