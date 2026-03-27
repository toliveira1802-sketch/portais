import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const meses = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export default function ColaboradorHolerite({ user }: { user: any }) {
  const [holerites, setHolerites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("holerites")
          .select("*")
          .eq("colaborador_id", user.id)
          .order("competencia", { ascending: false })
          .limit(12)

        setHolerites(data || [])
      } catch {
        // tabela pode nao existir
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Holerites</h2>
        <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Seus recibos de pagamento</p>
      </div>

      {/* Info do colaborador */}
      <div style={{ ...cardStyle, marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: "linear-gradient(135deg, #0891b2, #06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: "700", color: "#fff",
        }}>
          {(user.nome || "C")[0].toUpperCase()}
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>{user.nome}</div>
          <div style={{ color: "#71717a", fontSize: "12px" }}>{user.cargo || "Colaborador"}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      ) : holerites.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💰</div>
          <div style={{ color: "#e4e4e7", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Nenhum holerite disponivel</div>
          <div style={{ color: "#71717a", fontSize: "13px" }}>Seus holerites aparecerão aqui quando forem processados</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {holerites.map((h: any, i: number) => {
            const comp = h.competencia || ""
            const [ano, mes] = comp.split("-")
            const mesNome = meses[parseInt(mes) - 1] || mes
            return (
              <div key={i} style={{
                ...cardStyle, padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                  }}>📄</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{mesNome} {ano}</div>
                    <div style={{ color: "#71717a", fontSize: "11px" }}>Competencia: {comp}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#22c55e", fontSize: "16px", fontWeight: "700" }}>
                    R$ {Number(h.valor_liquido || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ color: "#71717a", fontSize: "10px" }}>Liquido</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
