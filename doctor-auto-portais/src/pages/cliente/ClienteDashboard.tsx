import { useEffect, useState } from "react"
import ClienteLayout from "../../components/ClienteLayout"
import { supabase } from "../../lib/supabase"

const EMPRESA_ID = "5c7a45b6-735a-42bd-9e95-4d0d53bf2fd5"

export default function ClienteDashboardPage({ onNavigate, onLogout }: { onNavigate: (k: string) => void; onLogout: () => void }) {
  const [clienteNome, setClienteNome] = useState("Cliente")
  const [veiculosCount, setVeiculosCount] = useState(0)
  const [osAtivas, setOsAtivas] = useState<any[]>([])
  const [osHistorico, setOsHistorico] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      // Pega primeiro cliente com OS (simula login)
      const { data: clientes } = await supabase.from("clientes").select("id_cliente, nome")
        .eq("id_companies", EMPRESA_ID).eq("ativo", true).limit(1)
      if (!clientes || clientes.length === 0) { setLoading(false); return }

      const cliente = clientes[0]
      setClienteNome(cliente.nome.split(" ").slice(0, 2).join(" "))

      const { count: vCount } = await supabase.from("veiculos").select("id_veiculo", { count: "exact", head: true })
        .eq("id_cliente", cliente.id_cliente)
      setVeiculosCount(vCount || 0)

      const { data: ativas } = await supabase.from("ordens_servico")
        .select("*, veiculo:id_veiculo(placa, marca, modelo)")
        .eq("id_cliente", cliente.id_cliente)
        .in("status", ["aberta", "em_andamento", "aguardando_peca", "aguardando_aprovacao"])
        .order("created_at", { ascending: false })
      setOsAtivas(ativas || [])

      const { data: hist } = await supabase.from("ordens_servico")
        .select("numero_os, reclamacao_cliente, data_entrega, valor_final, status")
        .eq("id_cliente", cliente.id_cliente)
        .in("status", ["finalizada", "entregue"])
        .order("data_entrega", { ascending: false })
        .limit(5)
      setOsHistorico(hist || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const osConcluidas = osHistorico.length

  return (
    <ClienteLayout activeKey="cli-dashboard" onNavigate={onNavigate} onLogout={onLogout} nome={clienteNome}>
      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff" }}>Ola, {clienteNome.split(" ")[0]}!</h1>
          <p style={{ color: "#71717a", fontSize: "13px", marginTop: "4px" }}>Acompanhe seus veiculos e servicos</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
          {[
            { label: "Veiculos", count: loading ? "..." : veiculosCount, icon: "🚗", c: "#60a5fa", bg: "rgba(96,165,250,0.08)", b: "rgba(96,165,250,0.2)" },
            { label: "OS Ativas", count: loading ? "..." : osAtivas.length, icon: "⚠️", c: "#fb923c", bg: "rgba(251,146,60,0.08)", b: "rgba(251,146,60,0.2)" },
            { label: "OS Concluidas", count: loading ? "..." : osConcluidas, icon: "✅", c: "#4ade80", bg: "rgba(74,222,128,0.08)", b: "rgba(74,222,128,0.2)" },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.b}`, borderRadius: "14px", padding: "18px 20px" }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: c.c }}>{c.count}</div>
              <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* OS Ativas */}
        {osAtivas.length > 0 ? osAtivas.map(os => (
          <div key={os.id_os} style={{ background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "14px", padding: "18px 20px" }}>
            <h2 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              ⏳ OS em Andamento
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ color: "#f87171", fontWeight: "700", fontSize: "12px", fontFamily: "monospace" }}>OS-{String(os.numero_os).padStart(5, "0")}</span>
                <div style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginTop: "4px" }}>{os.reclamacao_cliente || "Servico em andamento"}</div>
                <div style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>
                  {os.veiculo?.placa} · {os.veiculo?.marca} {os.veiculo?.modelo}
                  {os.data_previsao && ` · Previsao: ${new Date(os.data_previsao).toLocaleDateString("pt-BR")}`}
                </div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.2)" }}>
                {os.status.replace("_", " ")}
              </span>
            </div>
          </div>
        )) : !loading && (
          <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span>
            <span style={{ color: "#d4d4d8", fontSize: "13px" }}>Nenhuma OS em andamento no momento</span>
          </div>
        )}

        {/* Historico */}
        <div>
          <h2 style={{ color: "#e4e4e7", fontWeight: "600", fontSize: "14px", marginBottom: "12px" }}>📄 Historico Recente</h2>
          <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "14px", overflow: "hidden" }}>
            {osHistorico.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#52525b", fontSize: "13px" }}>Nenhum historico disponivel</div>
            ) : osHistorico.map((os, i) => (
              <div key={os.numero_os} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px",
                borderBottom: i < osHistorico.length - 1 ? "1px solid #1f1f23" : "none"
              }}>
                <div>
                  <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{os.reclamacao_cliente || "Servico"}</div>
                  <div style={{ color: "#52525b", fontSize: "11px", marginTop: "2px" }}>
                    OS-{String(os.numero_os).padStart(5, "0")} · {os.data_entrega ? new Date(os.data_entrega).toLocaleDateString("pt-BR") : "—"}
                  </div>
                </div>
                <div style={{ color: "#4ade80", fontWeight: "600", fontSize: "13px" }}>
                  {os.valor_final ? `R$ ${Number(os.valor_final).toFixed(2)}` : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClienteLayout>
  )
}
