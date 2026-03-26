import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase, getClientes, getVeiculosByCliente, createCliente, createVeiculo, createOrdemServico } from "../lib/supabase"

const COR = "#1d4ed8"

interface MecanicoOpt { id: string; nome: string }

export default function NovaOS({ onNavigate }: { onNavigate: (k: string) => void }) {
  const { consultor } = useAuth()
  const [step, setStep] = useState(1)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  // Step 1 - Cliente
  const [clientes, setClientes] = useState<any[]>([])
  const [buscaCliente, setBuscaCliente] = useState("")
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null)
  const [novoCliente, setNovoCliente] = useState(false)
  const [formCliente, setFormCliente] = useState({ nome: "", telefone: "", cpf_cnpj: "", email: "" })

  // Step 1 - Veiculo
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<any>(null)
  const [novoVeiculo, setNovoVeiculo] = useState(false)
  const [formVeiculo, setFormVeiculo] = useState({ placa: "", marca: "", modelo: "", ano: "", cor: "", km_atual: "" })

  // Step 2 - Servico
  const [mecanicos, setMecanicos] = useState<MecanicoOpt[]>([])
  const [formOS, setFormOS] = useState({
    reclamacao_cliente: "", prioridade: "normal", id_mecanico: "",
    km_entrada: "", data_previsao: "", observacoes_internas: ""
  })

  useEffect(() => {
    if (consultor?.empresa_id) {
      getClientes(consultor.empresa_id).then(d => setClientes(d || []))
      supabase.from("colaboradores_portal_mecanico").select("id, nome")
        .eq("empresa_id", consultor.empresa_id).eq("ativo", true).order("nome")
        .then(({ data }) => setMecanicos(data || []))
    }
  }, [consultor])

  useEffect(() => {
    if (clienteSelecionado) {
      getVeiculosByCliente(clienteSelecionado.id_cliente).then(d => { setVeiculos(d || []); setVeiculoSelecionado(null) })
    }
  }, [clienteSelecionado])

  const clientesFiltrados = clientes.filter(c =>
    c.nome?.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.telefone?.includes(buscaCliente) ||
    c.cpf_cnpj?.includes(buscaCliente)
  )

  const handleSalvar = async () => {
    setSalvando(true)
    setErro("")
    try {
      let clienteId = clienteSelecionado?.id_cliente
      let veiculoId = veiculoSelecionado?.id_veiculo

      // Criar cliente se novo
      if (novoCliente && !clienteId) {
        const novo = await createCliente({
          ...formCliente, id_companies: consultor!.empresa_id, origem: "portal_consultor", ativo: true
        })
        clienteId = novo.id_cliente
      }

      // Criar veiculo se novo
      if (novoVeiculo && !veiculoId) {
        const novo = await createVeiculo({
          ...formVeiculo, id_cliente: clienteId, id_companies: consultor!.empresa_id,
          ano: formVeiculo.ano ? parseInt(formVeiculo.ano) : null,
          km_atual: formVeiculo.km_atual ? parseInt(formVeiculo.km_atual) : null,
          ativo: true
        })
        veiculoId = novo.id_veiculo
      }

      // Criar OS
      await createOrdemServico({
        id_companies: consultor!.empresa_id,
        id_cliente: clienteId,
        id_veiculo: veiculoId,
        id_consultor: consultor!.id,
        id_mecanico: formOS.id_mecanico || null,
        status: "aberta",
        km_entrada: formOS.km_entrada ? parseInt(formOS.km_entrada) : null,
        reclamacao_cliente: formOS.reclamacao_cliente || null,
        observacoes_internas: formOS.observacoes_internas || null,
        prioridade: formOS.prioridade,
        data_entrada: new Date().toISOString(),
        data_previsao: formOS.data_previsao ? new Date(formOS.data_previsao).toISOString() : null,
        valor_total: 0, valor_desconto: 0, valor_final: 0,
      })
      setSucesso(true)
    } catch (e: any) {
      setErro(e.message || "Erro ao criar OS")
    } finally {
      setSalvando(false)
    }
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#e4e4e7",
    fontSize: "13px", outline: "none", boxSizing: "border-box", fontFamily: "inherit"
  }
  const label: React.CSSProperties = { display: "block", color: "#6b7280", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px" }
  const cardStyle: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px" }

  // Sucesso
  if (sucesso) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>✓</div>
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>OS Criada com Sucesso!</h2>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>A ordem de servico foi registrada no sistema</p>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button onClick={() => { setSucesso(false); setStep(1); setClienteSelecionado(null); setVeiculoSelecionado(null); setNovoCliente(false); setNovoVeiculo(false) }}
            style={{ padding: "10px 20px", background: COR, border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            + Criar Outra OS
          </button>
          <button onClick={() => onNavigate("patio")}
            style={{ padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
            Ver Patio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      {/* Steps indicator */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {[
          { n: 1, label: "Cliente e Veiculo" },
          { n: 2, label: "Servico e Detalhes" },
          { n: 3, label: "Revisar e Criar" },
        ].map(s => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "700", flexShrink: 0,
              background: step >= s.n ? COR : "rgba(255,255,255,0.05)",
              color: step >= s.n ? "#fff" : "#6b7280",
              border: step >= s.n ? "none" : "1px solid rgba(255,255,255,0.1)"
            }}>{s.n}</div>
            <span style={{ color: step >= s.n ? "#e4e4e7" : "#52525b", fontSize: "13px", fontWeight: step === s.n ? "600" : "400" }}>{s.label}</span>
            {s.n < 3 && <div style={{ flex: 1, height: "1px", background: step > s.n ? COR : "rgba(255,255,255,0.08)", marginLeft: "8px" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 - Cliente + Veiculo */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Cliente */}
          <div style={cardStyle}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>👤 Cliente</h3>

            {!novoCliente && !clienteSelecionado && (
              <>
                <input value={buscaCliente} onChange={e => setBuscaCliente(e.target.value)} placeholder="Buscar cliente por nome, telefone ou CPF..."
                  style={{ ...inp, marginBottom: "12px" }} />
                {buscaCliente && clientesFiltrados.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", maxHeight: "200px", overflowY: "auto" }}>
                    {clientesFiltrados.slice(0, 5).map(c => (
                      <button key={c.id_cliente} onClick={() => { setClienteSelecionado(c); setBuscaCliente("") }}
                        style={{ ...cardStyle, padding: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(29,78,216,0.4)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"}
                      >
                        <div>
                          <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{c.nome}</div>
                          <div style={{ color: "#6b7280", fontSize: "11px" }}>{c.telefone || "Sem telefone"}</div>
                        </div>
                        <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "monospace" }}>{c.cpf_cnpj || ""}</span>
                      </button>
                    ))}
                  </div>
                )}
                {buscaCliente && clientesFiltrados.length === 0 && (
                  <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "12px" }}>Nenhum cliente encontrado</div>
                )}
                <button onClick={() => setNovoCliente(true)}
                  style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#9ca3af", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                  + Cadastrar Novo Cliente
                </button>
              </>
            )}

            {clienteSelecionado && !novoCliente && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "10px" }}>
                <div>
                  <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{clienteSelecionado.nome}</div>
                  <div style={{ color: "#6b7280", fontSize: "12px" }}>{clienteSelecionado.telefone} {clienteSelecionado.cpf_cnpj ? `· ${clienteSelecionado.cpf_cnpj}` : ""}</div>
                </div>
                <button onClick={() => { setClienteSelecionado(null); setVeiculos([]); setVeiculoSelecionado(null) }}
                  style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "12px" }}>✕ Trocar</button>
              </div>
            )}

            {novoCliente && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div><label style={label}>Nome *</label><input style={inp} value={formCliente.nome} onChange={e => setFormCliente({ ...formCliente, nome: e.target.value })} placeholder="Nome completo" /></div>
                  <div><label style={label}>Telefone</label><input style={inp} value={formCliente.telefone} onChange={e => setFormCliente({ ...formCliente, telefone: e.target.value })} placeholder="(11) 99999-9999" /></div>
                  <div><label style={label}>CPF/CNPJ</label><input style={inp} value={formCliente.cpf_cnpj} onChange={e => setFormCliente({ ...formCliente, cpf_cnpj: e.target.value })} placeholder="000.000.000-00" /></div>
                  <div><label style={label}>Email</label><input style={inp} value={formCliente.email} onChange={e => setFormCliente({ ...formCliente, email: e.target.value })} placeholder="email@exemplo.com" /></div>
                </div>
                <button onClick={() => { setNovoCliente(false); setFormCliente({ nome: "", telefone: "", cpf_cnpj: "", email: "" }) }}
                  style={{ marginTop: "10px", background: "transparent", border: "none", color: "#6b7280", fontSize: "12px", cursor: "pointer" }}>← Voltar para busca</button>
              </div>
            )}
          </div>

          {/* Veiculo */}
          <div style={cardStyle}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>🚗 Veiculo</h3>

            {clienteSelecionado && veiculos.length > 0 && !veiculoSelecionado && !novoVeiculo && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                {veiculos.map(v => (
                  <button key={v.id_veiculo} onClick={() => setVeiculoSelecionado(v)}
                    style={{ ...cardStyle, padding: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(29,78,216,0.4)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"}
                  >
                    <div>
                      <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500" }}>{v.marca} {v.modelo}</div>
                      <div style={{ color: "#6b7280", fontSize: "11px" }}>{v.ano || ""} {v.cor ? `· ${v.cor}` : ""}</div>
                    </div>
                    <span style={{ color: COR, fontSize: "13px", fontWeight: "600", fontFamily: "monospace" }}>{v.placa}</span>
                  </button>
                ))}
              </div>
            )}

            {veiculoSelecionado && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "10px", marginBottom: "12px" }}>
                <div>
                  <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>{veiculoSelecionado.placa} — {veiculoSelecionado.marca} {veiculoSelecionado.modelo}</div>
                  <div style={{ color: "#6b7280", fontSize: "12px" }}>{veiculoSelecionado.ano || ""} {veiculoSelecionado.cor ? `· ${veiculoSelecionado.cor}` : ""} {veiculoSelecionado.km_atual ? `· ${veiculoSelecionado.km_atual} km` : ""}</div>
                </div>
                <button onClick={() => setVeiculoSelecionado(null)}
                  style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "12px" }}>✕ Trocar</button>
              </div>
            )}

            {(!clienteSelecionado && !novoCliente) && (
              <div style={{ color: "#52525b", fontSize: "13px" }}>Selecione um cliente primeiro</div>
            )}

            {(clienteSelecionado || novoCliente) && !veiculoSelecionado && (
              <>
                {!novoVeiculo ? (
                  <button onClick={() => setNovoVeiculo(true)}
                    style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#9ca3af", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                    + Cadastrar Novo Veiculo
                  </button>
                ) : (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={label}>Placa *</label><input style={inp} value={formVeiculo.placa} onChange={e => setFormVeiculo({ ...formVeiculo, placa: e.target.value.toUpperCase() })} placeholder="ABC1D23" /></div>
                      <div><label style={label}>Marca</label><input style={inp} value={formVeiculo.marca} onChange={e => setFormVeiculo({ ...formVeiculo, marca: e.target.value })} placeholder="Honda" /></div>
                      <div><label style={label}>Modelo</label><input style={inp} value={formVeiculo.modelo} onChange={e => setFormVeiculo({ ...formVeiculo, modelo: e.target.value })} placeholder="Civic" /></div>
                      <div><label style={label}>Ano</label><input style={inp} value={formVeiculo.ano} onChange={e => setFormVeiculo({ ...formVeiculo, ano: e.target.value })} placeholder="2024" /></div>
                      <div><label style={label}>Cor</label><input style={inp} value={formVeiculo.cor} onChange={e => setFormVeiculo({ ...formVeiculo, cor: e.target.value })} placeholder="Prata" /></div>
                      <div><label style={label}>KM Atual</label><input style={inp} value={formVeiculo.km_atual} onChange={e => setFormVeiculo({ ...formVeiculo, km_atual: e.target.value })} placeholder="45000" /></div>
                    </div>
                    <button onClick={() => { setNovoVeiculo(false); setFormVeiculo({ placa: "", marca: "", modelo: "", ano: "", cor: "", km_atual: "" }) }}
                      style={{ marginTop: "10px", background: "transparent", border: "none", color: "#6b7280", fontSize: "12px", cursor: "pointer" }}>← Voltar</button>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setStep(2)} disabled={!(clienteSelecionado || (novoCliente && formCliente.nome)) || !(veiculoSelecionado || (novoVeiculo && formVeiculo.placa))}
              style={{ padding: "10px 24px", background: COR, border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", opacity: (clienteSelecionado || (novoCliente && formCliente.nome)) && (veiculoSelecionado || (novoVeiculo && formVeiculo.placa)) ? 1 : 0.4 }}>
              Proximo →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 - Servico */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>📋 Detalhes do Servico</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={label}>Reclamacao do Cliente *</label>
                <textarea style={{ ...inp, minHeight: "80px", resize: "vertical" }} value={formOS.reclamacao_cliente}
                  onChange={e => setFormOS({ ...formOS, reclamacao_cliente: e.target.value })} placeholder="Descreva o que o cliente relatou..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={label}>Prioridade</label>
                  <select style={inp} value={formOS.prioridade} onChange={e => setFormOS({ ...formOS, prioridade: e.target.value })}>
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label style={label}>Mecanico</label>
                  <select style={inp} value={formOS.id_mecanico} onChange={e => setFormOS({ ...formOS, id_mecanico: e.target.value })}>
                    <option value="">Nao atribuido</option>
                    {mecanicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>KM Entrada</label>
                  <input style={inp} value={formOS.km_entrada} onChange={e => setFormOS({ ...formOS, km_entrada: e.target.value })} placeholder="45000" />
                </div>
                <div>
                  <label style={label}>Previsao de Entrega</label>
                  <input type="date" style={inp} value={formOS.data_previsao} onChange={e => setFormOS({ ...formOS, data_previsao: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={label}>Observacoes Internas</label>
                <textarea style={{ ...inp, minHeight: "60px", resize: "vertical" }} value={formOS.observacoes_internas}
                  onChange={e => setFormOS({ ...formOS, observacoes_internas: e.target.value })} placeholder="Notas internas (nao visivel ao cliente)..." />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={{ padding: "10px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
              ← Voltar
            </button>
            <button onClick={() => setStep(3)} disabled={!formOS.reclamacao_cliente}
              style={{ padding: "10px 24px", background: COR, border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", opacity: formOS.reclamacao_cliente ? 1 : 0.4 }}>
              Proximo →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 - Revisao */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={cardStyle}>
            <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>✅ Revisar OS</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Cliente</div>
                <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>
                  {clienteSelecionado?.nome || formCliente.nome || "—"}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px" }}>
                  {clienteSelecionado?.telefone || formCliente.telefone || ""}
                </div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Veiculo</div>
                <div style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: "600" }}>
                  {veiculoSelecionado ? `${veiculoSelecionado.placa} — ${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}` : `${formVeiculo.placa} — ${formVeiculo.marca} ${formVeiculo.modelo}`}
                </div>
                <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px" }}>
                  {formOS.km_entrada ? `${formOS.km_entrada} km` : ""}
                </div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", gridColumn: "1 / -1" }}>
                <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Reclamacao</div>
                <div style={{ color: "#e4e4e7", fontSize: "13px" }}>{formOS.reclamacao_cliente}</div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Prioridade</div>
                <div style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: "500", textTransform: "capitalize" }}>{formOS.prioridade}</div>
              </div>
              <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#6b7280", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Mecanico</div>
                <div style={{ color: "#e4e4e7", fontSize: "13px" }}>{mecanicos.find(m => m.id === formOS.id_mecanico)?.nome || "Nao atribuido"}</div>
              </div>
            </div>
          </div>

          {erro && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", color: "#fca5a5", fontSize: "13px" }}>{erro}</div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={{ padding: "10px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#9ca3af", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
              ← Voltar
            </button>
            <button onClick={handleSalvar} disabled={salvando}
              style={{ padding: "10px 28px", background: "#10b981", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: salvando ? "wait" : "pointer", fontFamily: "inherit", opacity: salvando ? 0.6 : 1 }}>
              {salvando ? "Criando..." : "✓ Criar Ordem de Servico"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
