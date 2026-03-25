import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const COR = "#10b981"

interface TabelaInfo {
  nome: string
  nomeReal: string
  rows: number
  categoria: string
}

const TABELAS: { nome: string; nomeReal: string; categoria: string }[] = [
  { nome: "Companies", nomeReal: "companies", categoria: "Auth & Config" },
  { nome: "Consultores", nomeReal: "colaboradores_portal_consultor", categoria: "Auth & Config" },
  { nome: "Gestao", nomeReal: "colaboradores_portal_gestao", categoria: "Auth & Config" },
  { nome: "Mecanicos", nomeReal: "colaboradores_portal_mecanico", categoria: "Auth & Config" },
  { nome: "Developers", nomeReal: "colaboradores_portal_dev", categoria: "Auth & Config" },
  { nome: "Nivel Acesso", nomeReal: "nivel_acesso", categoria: "Auth & Config" },
  { nome: "Clientes", nomeReal: "clientes", categoria: "Core Operacional" },
  { nome: "Veiculos", nomeReal: "veiculos", categoria: "Core Operacional" },
  { nome: "Ordens Servico", nomeReal: "ordens_servico", categoria: "Core Operacional" },
  { nome: "Workflow Etapas", nomeReal: "workflow_etapas", categoria: "Core Operacional" },
]

export default function DevBanco() {
  const [tabelas, setTabelas] = useState<TabelaInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<{ nome: string; data: any[] } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const results: TabelaInfo[] = []
    for (const t of TABELAS) {
      const { count } = await supabase.from(t.nomeReal).select("*", { count: "exact", head: true })
      results.push({ nome: t.nome, nomeReal: t.nomeReal, rows: count || 0, categoria: t.categoria })
    }
    setTabelas(results)
    setLoading(false)
  }

  const previewTabela = async (nomeReal: string, nome: string) => {
    setPreviewLoading(true)
    setPreview(null)
    const { data } = await supabase.from(nomeReal).select("*").limit(10)
    setPreview({ nome, data: data || [] })
    setPreviewLoading(false)
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  const totalRows = tabelas.reduce((a, t) => a + t.rows, 0)
  const populadas = tabelas.filter(t => t.rows > 0).length
  const categorias = [...new Set(TABELAS.map(t => t.categoria))]

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700" }}>Banco de Dados</h2>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Visualize todas as tabelas e seus dados</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Tabelas", valor: tabelas.length },
          { label: "Total Rows", valor: totalRows },
          { label: "Populadas", valor: populadas },
          { label: "Vazias", valor: tabelas.length - populadas },
        ].map((k, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ color: "#6b7280", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{k.label}</div>
            <div style={{ color: "#fff", fontSize: "24px", fontWeight: "700" }}>{k.valor}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#52525b" }}>Carregando tabelas...</div>
      ) : (
        <>
          {/* Tabelas por categoria */}
          {categorias.map(cat => (
            <div key={cat} style={{ marginBottom: "24px" }}>
              <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{cat}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {tabelas.filter(t => t.categoria === cat).map(t => (
                  <button key={t.nomeReal} onClick={() => previewTabela(t.nomeReal, t.nome)} style={{
                    ...cardStyle, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    borderColor: preview?.nome === t.nome ? COR : "rgba(255,255,255,0.08)"
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = COR}
                    onMouseLeave={e => { if (preview?.nome !== t.nome) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{t.nome}</div>
                        <div style={{ color: "#52525b", fontSize: "11px", fontFamily: "monospace", marginTop: "2px" }}>{t.nomeReal}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>{t.rows}</div>
                        <div style={{ color: "#6b7280", fontSize: "11px" }}>rows</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Preview */}
          {previewLoading && (
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px", color: "#52525b" }}>Carregando preview...</div>
          )}
          {preview && !previewLoading && (
            <div style={{ marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>
                  Preview: {preview.nome} ({preview.data.length} registros)
                </h3>
                <button onClick={() => setPreview(null)} style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                  Fechar
                </button>
              </div>
              <div style={{ ...cardStyle, overflowX: "auto" }}>
                {preview.data.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#52525b" }}>Tabela vazia</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr>
                        {Object.keys(preview.data[0]).map(col => (
                          <th key={col} style={{ textAlign: "left", padding: "8px 10px", color: COR, fontSize: "11px", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.data.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((val, j) => (
                            <td key={j} style={{ padding: "8px 10px", color: "#d4d4d8", borderBottom: "1px solid rgba(255,255,255,0.03)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {val === null ? <span style={{ color: "#52525b", fontStyle: "italic" }}>null</span> : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
