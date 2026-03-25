import ClienteLayout from "../../components/ClienteLayout";

const MOCK_OS_ATIVA = { numero:"OS01021", servico:"Troca de oleo + filtros", status:"em_execucao", previsao:"Hoje 18h", veiculo:"Gol 1.0 · ABC1D23" };
const MOCK_HIST = [
  { numero:"OS00981", servico:"Revisao 40.000km", data:"15/02/2026", valor:"R$ 620,00" },
  { numero:"OS00945", servico:"Troca pneus dianteiros", data:"08/01/2026", valor:"R$ 480,00" },
  { numero:"OS00912", servico:"Alinhamento + balanceamento", data:"22/12/2025", valor:"R$ 120,00" },
];

export default function ClienteDashboardPage({ onNavigate, onLogout }: { onNavigate:(k:string)=>void; onLogout:()=>void }) {
  return (
    <ClienteLayout activeKey="cli-dashboard" onNavigate={onNavigate} onLogout={onLogout} nome="Carlos Mendes">
      <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:"24px" }}>
        <div>
          <h1 style={{ fontSize:"22px", fontWeight:"700", color:"#fff" }}>Ola, Carlos! 👋</h1>
          <p style={{ color:"#71717a", fontSize:"13px", marginTop:"4px" }}>Acompanhe seus veiculos e servicos</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
          {[
            {label:"Veiculos",count:2,icon:"🚗",c:"#60a5fa",bg:"rgba(96,165,250,0.08)",b:"rgba(96,165,250,0.2)"},
            {label:"OS Ativas",count:1,icon:"⚠️",c:"#fb923c",bg:"rgba(251,146,60,0.08)",b:"rgba(251,146,60,0.2)"},
            {label:"OS Concluidas",count:12,icon:"✅",c:"#4ade80",bg:"rgba(74,222,128,0.08)",b:"rgba(74,222,128,0.2)"},
          ].map(c => (
            <div key={c.label} style={{ background:c.bg, border:`1px solid ${c.b}`, borderRadius:"14px", padding:"18px 20px" }}>
              <div style={{ fontSize:"22px", marginBottom:"8px" }}>{c.icon}</div>
              <div style={{ fontSize:"24px", fontWeight:"700", color:c.c }}>{c.count}</div>
              <div style={{ color:"#71717a", fontSize:"12px", marginTop:"2px" }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"rgba(251,146,60,0.05)", border:"1px solid rgba(251,146,60,0.2)", borderRadius:"14px", padding:"18px 20px" }}>
          <h2 style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px", marginBottom:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
            ⏳ OS em Andamento
          </h2>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <span style={{ color:"#f87171", fontWeight:"700", fontSize:"12px", fontFamily:"monospace" }}>{MOCK_OS_ATIVA.numero}</span>
              <div style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px", marginTop:"4px" }}>{MOCK_OS_ATIVA.servico}</div>
              <div style={{ color:"#71717a", fontSize:"12px", marginTop:"2px" }}>{MOCK_OS_ATIVA.veiculo} · Previsao: {MOCK_OS_ATIVA.previsao}</div>
            </div>
            <span style={{ padding:"4px 10px", borderRadius:"99px", fontSize:"11px", background:"rgba(251,146,60,0.1)", color:"#fb923c", border:"1px solid rgba(251,146,60,0.2)" }}>Em execucao</span>
          </div>
        </div>

        <div>
          <h2 style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px", marginBottom:"12px" }}>📄 Historico Recente</h2>
          <div style={{ background:"#111113", border:"1px solid #27272a", borderRadius:"14px", overflow:"hidden" }}>
            {MOCK_HIST.map((os, i) => (
              <div key={os.numero} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px",
                borderBottom: i < MOCK_HIST.length-1 ? "1px solid #1f1f23" : "none"
              }}>
                <div>
                  <div style={{ color:"#e4e4e7", fontSize:"13px", fontWeight:"500" }}>{os.servico}</div>
                  <div style={{ color:"#52525b", fontSize:"11px", marginTop:"2px" }}>{os.numero} · {os.data}</div>
                </div>
                <div style={{ color:"#4ade80", fontWeight:"600", fontSize:"13px" }}>{os.valor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClienteLayout>
  );
}
