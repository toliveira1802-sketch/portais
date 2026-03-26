import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

type VeiculoOrfao = { id_veiculo: string; placa: string; marca?: string; modelo?: string; ano?: number; cor?: string; km_atual?: number; created_at: string; cliente?: { nome: string; telefone?: string } }

export default function GestaoOrfaos() {
  const [veiculos, setVeiculos] = useState<VeiculoOrfao[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")

  useEffect(() => { fetchOrfaos() }, [])

  const fetchOrfaos = async () => {
    try {
      // Buscar veiculos que nao tem OS aberta
      const { data: veiculosAll } = await supabase.from("veiculos")
        .select("id_veiculo, placa, marca, modelo, ano, cor, km_atual, created_at, cliente:id_cliente(nome, telefone)")
        .eq("id_companies", EMPRESA_ID).eq("ativo", true)

      const { data: osAbertas } = await supabase.from("ordens_servico")
        .select("id_veiculo")
        .eq("id_companies", EMPRESA_ID)
        .in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao", "finalizada"])

      const veiculosComOS = new Set(osAbertas?.map((os: any) => os.id_veiculo) || [])
      const orfaos = (veiculosAll || []).filter((v: any) => !veiculosComOS.has(v.id_veiculo))

      setVeiculos(orfaos as any)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const filtrados = busca ? veiculos.filter(v =>
    v.placa?.toLowerCase().includes(busca.toLowerCase()) ||
    v.marca?.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
    (v.cliente as any)?.nome?.toLowerCase().includes(busca.toLowerCase())
  ) : veiculos

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px" }
  const inp: React.CSSProperties = { padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit" }

  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Veiculos Orfaos</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Veiculos cadastrados sem OS ativa</p>
        </div>
        <span style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c", padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>
          {veiculos.length} veiculos
        </span>
      </div>

      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por placa, marca, modelo ou cliente..." style={{ ...inp, maxWidth: "400px", boxSizing: "border-box" }} />

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Placa", "Marca/Modelo", "Ano", "Cor", "KM", "Cliente", "Telefone", "Cadastro"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#71717a", fontWeight: "600", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>Carregando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#52525b" }}>
                  {busca ? "Nenhum veiculo encontrado" : "Todos os veiculos tem OS ativa"}
                </td></tr>
              ) : filtrados.map(v => (
                <tr key={v.id_veiculo} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 14px", color: "#fb923c", fontWeight: "700" }}>{v.placa}</td>
                  <td style={{ padding: "12px 14px", color: "#e4e4e7" }}>{[v.marca, v.modelo].filter(Boolean).join(" ") || "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#71717a" }}>{v.ano || "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#71717a", textTransform: "capitalize" }}>{v.cor || "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#71717a" }}>{v.km_atual ? `${v.km_atual.toLocaleString()} km` : "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#d4d4d8" }}>{(v.cliente as any)?.nome || "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#52525b", fontSize: "12px" }}>{(v.cliente as any)?.telefone || "—"}</td>
                  <td style={{ padding: "12px 14px", color: "#52525b", fontSize: "12px" }}>{new Date(v.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...card, background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <div>
            <div style={{ color: "#fb923c", fontWeight: "600", fontSize: "13px" }}>Oportunidade</div>
            <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>Esses veiculos nao tem OS ativa. Considere entrar em contato com os donos para oferecer revisao preventiva ou check-up.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
