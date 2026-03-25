import MecanicoLayout from "../../components/MecanicoLayout";
import { useState } from "react";

const MOCK_OS = [
  { id:"1", numero:"OS01023", cliente:"Carlos Mendes", placa:"ABC1D23", modelo:"Gol 1.0", servico:"Troca de oleo + filtros", status:"em_execucao", prioridade:"alta", km:52300, previsao:"Hoje 18h" },
  { id:"2", numero:"OS01024", cliente:"Ana Paula Silva", placa:"XYZ9A88", modelo:"Civic EXL", servico:"Revisao completa 50.000km", status:"aguardando_peca", prioridade:"media", km:51200, previsao:"Amanha" },
  { id:"3", numero:"OS01025", cliente:"Roberto Lima", placa:"DEF4E56", modelo:"HB20", servico:"Alinhamento e balanceamento", status:"aprovado", prioridade:"baixa", km:28700, previsao:"25/03" },
  { id:"4", numero:"OS01026", cliente:"Fernanda Costa", placa:"GHI7F89", modelo:"Argo Drive", servico:"Troca pastilha freio", status:"diagnostico", prioridade:"alta", km:38900, previsao:"Hoje 16h" },
];

const STATUS: Record<string,{label:string;c:string;bg:string}> = {
  em_execucao: { label:"Em Execucao", c:"#fb923c", bg:"rgba(251,146,60,0.1)" },
  aguardando_peca: { label:"Aguard. Peca", c:"#f87171", bg:"rgba(248,113,113,0.1)" },
  aprovado: { label:"Aprovado", c:"#4ade80", bg:"rgba(74,222,128,0.1)" },
  diagnostico: { label:"Diagnostico", c:"#c084fc", bg:"rgba(192,132,252,0.1)" },
};

export default function MecanicoOSPage({ onNavigate, onLogout }: { onNavigate:(k:string)=>void; onLogout:()=>void }) {
  const [filter, setFilter] = useState("todos");
  const filtered = filter === "todos" ? MOCK_OS : MOCK_OS.filter(o => o.status === filter);

  return (
    <MecanicoLayout activeKey="mec-os" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ padding:"28px 32px" }}>
        <div style={{ marginBottom:"24px" }}>
          <h1 style={{ fontSize:"22px", fontWeight:"700", color:"#fff" }}>Minhas OS</h1>
          <p style={{ color:"#71717a", fontSize:"13px", marginTop:"4px" }}>OS atribuidas a voce hoje</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"20px" }}>
          {[
            {label:"Em Execucao",c:"#fb923c",bg:"rgba(251,146,60,0.08)",b:"rgba(251,146,60,0.2)",v:1},
            {label:"Aguard. Peca",c:"#f87171",bg:"rgba(248,113,113,0.08)",b:"rgba(248,113,113,0.2)",v:1},
            {label:"Aprovadas",c:"#4ade80",bg:"rgba(74,222,128,0.08)",b:"rgba(74,222,128,0.2)",v:1},
            {label:"Diagnostico",c:"#c084fc",bg:"rgba(192,132,252,0.08)",b:"rgba(192,132,252,0.2)",v:1},
          ].map(c => (
            <div key={c.label} style={{ background:c.bg, border:`1px solid ${c.b}`, borderRadius:"12px", padding:"14px 16px" }}>
              <div style={{ fontSize:"24px", fontWeight:"700", color:c.c }}>{c.v}</div>
              <div style={{ color:"#71717a", fontSize:"12px", marginTop:"2px" }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
          {["todos","em_execucao","aguardando_peca","aprovado","diagnostico"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"6px 14px", borderRadius:"99px", fontSize:"12px", cursor:"pointer", fontFamily:"inherit",
              background: filter===f?"#ea580c":"rgba(255,255,255,0.05)",
              color: filter===f?"#fff":"#71717a",
              border:`1px solid ${filter===f?"#ea580c":"rgba(255,255,255,0.1)"}`
            }}>{f==="todos"?"Todas":STATUS[f]?.label||f}</button>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {filtered.map(os => {
            const s = STATUS[os.status]||{label:os.status,c:"#a1a1aa",bg:"rgba(161,161,170,0.1)"};
            return (
              <div key={os.id} style={{ background:"#111113", border:"1px solid #27272a", borderRadius:"14px", padding:"18px 20px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"10px" }}>
                  <div>
                    <span style={{ color:"#f87171", fontWeight:"700", fontSize:"13px", fontFamily:"monospace" }}>{os.numero}</span>
                    {os.prioridade==="alta" && <span style={{ marginLeft:"8px", fontSize:"11px", background:"rgba(239,68,68,0.1)", color:"#fca5a5", border:"1px solid rgba(239,68,68,0.2)", padding:"2px 7px", borderRadius:"99px" }}>URGENTE</span>}
                    <div style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"15px", marginTop:"4px" }}>{os.cliente}</div>
                    <div style={{ color:"#71717a", fontSize:"12px" }}>{os.placa} · {os.modelo}</div>
                  </div>
                  <span style={{ padding:"4px 10px", borderRadius:"99px", fontSize:"11px", fontWeight:"600", background:s.bg, color:s.c }}>{s.label}</span>
                </div>
                <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:"8px", padding:"8px 12px", color:"#d4d4d8", fontSize:"13px", marginBottom:"10px" }}>{os.servico}</div>
                <div style={{ display:"flex", justifyContent:"space-between", color:"#52525b", fontSize:"12px" }}>
                  <span>KM: {os.km.toLocaleString()}</span>
                  <span>⏰ {os.previsao}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MecanicoLayout>
  );
}
