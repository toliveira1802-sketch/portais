import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

interface RegistroPonto {
  id: string
  tipo: "entrada" | "saida" | "almoco_saida" | "almoco_retorno"
  data_registro: string
  hora: string
  created_at: string
}

const tipoLabels: Record<string, { label: string; icon: string; cor: string }> = {
  entrada: { label: "Entrada", icon: "🟢", cor: "#22c55e" },
  almoco_saida: { label: "Saida Almoco", icon: "🍽️", cor: "#eab308" },
  almoco_retorno: { label: "Retorno Almoco", icon: "🔄", cor: "#3b82f6" },
  saida: { label: "Saida", icon: "🔴", cor: "#ef4444" },
}

const sequencia = ["entrada", "almoco_saida", "almoco_retorno", "saida"]

export default function ColaboradorPonto({ user }: { user: any }) {
  const [registros, setRegistros] = useState<RegistroPonto[]>([])
  const [loading, setLoading] = useState(true)
  const [registrando, setRegistrando] = useState(false)
  const [horaAtual, setHoraAtual] = useState(new Date())
  const [historico, setHistorico] = useState<any[]>([])

  const hoje = new Date().toISOString().split("T")[0]

  useEffect(() => {
    loadRegistros()
    const timer = setInterval(() => setHoraAtual(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  async function loadRegistros() {
    try {
      const { data } = await supabase
        .from("registro_ponto")
        .select("*")
        .eq("colaborador_id", user.id)
        .gte("data_registro", hoje)
        .order("created_at", { ascending: true })

      setRegistros(data || [])

      // Historico ultimos 7 dias
      const seteDias = new Date()
      seteDias.setDate(seteDias.getDate() - 7)
      const { data: hist } = await supabase
        .from("registro_ponto")
        .select("*")
        .eq("colaborador_id", user.id)
        .gte("data_registro", seteDias.toISOString().split("T")[0])
        .lt("data_registro", hoje)
        .order("created_at", { ascending: false })

      setHistorico(hist || [])
    } catch {
      // tabela pode nao existir
    } finally {
      setLoading(false)
    }
  }

  const tiposRegistrados = registros.map(r => r.tipo)
  const proximoTipo = sequencia.find(t => !tiposRegistrados.includes(t))

  async function registrarPonto() {
    if (!proximoTipo) return
    setRegistrando(true)
    try {
      const agora = new Date()
      await supabase.from("registro_ponto").insert({
        colaborador_id: user.id,
        tipo: proximoTipo,
        data_registro: hoje,
        hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      })
      await loadRegistros()
    } catch {
      // erro silencioso
    } finally {
      setRegistrando(false)
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "20px",
  }

  return (
    <div>
      {/* Relogio */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ color: "#fff", fontSize: "48px", fontWeight: "700", fontVariantNumeric: "tabular-nums", letterSpacing: "-2px" }}>
          {horaAtual.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div style={{ color: "#71717a", fontSize: "14px", marginTop: "4px" }}>
          {horaAtual.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Botao registrar */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {proximoTipo ? (
          <button onClick={registrarPonto} disabled={registrando} style={{
            padding: "16px 48px", background: registrando ? "rgba(8,145,178,0.5)" : "#0891b2",
            border: "none", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: "700",
            cursor: registrando ? "wait" : "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(8,145,178,0.3)", transition: "all 0.2s",
          }}>
            {registrando ? "Registrando..." : `Registrar ${tipoLabels[proximoTipo]?.label || proximoTipo}`}
          </button>
        ) : (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px",
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "14px",
          }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <span style={{ color: "#22c55e", fontSize: "15px", fontWeight: "600" }}>Todos os pontos do dia registrados</span>
          </div>
        )}
      </div>

      {/* Registros de hoje */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Registros de Hoje</h3>
        {loading ? (
          <div style={{ color: "#71717a", fontSize: "13px" }}>Carregando...</div>
        ) : registros.length === 0 ? (
          <div style={{ color: "#71717a", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
            Nenhum registro hoje. Bata seu ponto acima.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {registros.map((r, i) => {
              const info = tipoLabels[r.tipo] || { label: r.tipo, icon: "⏺️", cor: "#71717a" }
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px" }}>{info.icon}</span>
                    <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{info.label}</span>
                  </div>
                  <span style={{ color: info.cor, fontSize: "14px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>{r.hora}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Timeline visual */}
      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Linha do Tempo</h3>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: "14px", left: "40px", right: "40px", height: "2px", background: "rgba(255,255,255,0.08)" }} />
          {sequencia.map((tipo, i) => {
            const registrado = tiposRegistrados.includes(tipo)
            const info = tipoLabels[tipo]
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: registrado ? info.cor : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", border: registrado ? "none" : "2px dashed rgba(255,255,255,0.15)",
                }}>
                  {registrado ? "✓" : ""}
                </div>
                <span style={{ color: registrado ? "#e4e4e7" : "#52525b", fontSize: "10px", fontWeight: "500" }}>{info.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historico */}
      {historico.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>Ultimos 7 dias</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {(() => {
              const porDia: Record<string, any[]> = {}
              historico.forEach(r => {
                if (!porDia[r.data_registro]) porDia[r.data_registro] = []
                porDia[r.data_registro].push(r)
              })
              return Object.entries(porDia).map(([data, regs]) => (
                <div key={data} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                }}>
                  <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "500" }}>
                    {new Date(data + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {regs.sort((a: any, b: any) => a.created_at.localeCompare(b.created_at)).map((r: any, j: number) => (
                      <span key={j} style={{ fontSize: "11px", color: tipoLabels[r.tipo]?.cor || "#71717a" }}>
                        {r.hora?.slice(0, 5)}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
