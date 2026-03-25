import { ReactNode } from "react";

const nav = [
  { icon:"🏠", label:"Meu Painel", key:"cli-dashboard" },
  { icon:"🚗", label:"Meus Veiculos", key:"cli-veiculos" },
  { icon:"📋", label:"Historico OS", key:"cli-os" },
  { icon:"⭐", label:"Avaliacoes", key:"cli-avaliacoes" },
];

export default function ClienteLayout({ children, activeKey, onNavigate, onLogout, nome }: {
  children: ReactNode; activeKey: string; onNavigate: (k:string) => void; onLogout: () => void; nome?: string;
}) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#09090b", fontFamily:"'Inter',sans-serif", color:"#e4e4e7" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;}`}</style>
      <aside style={{ width:"220px", background:"#111113", borderRight:"1px solid #27272a", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0 }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid #27272a", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", background:"#0d9488", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"13px" }}>Doctor Auto</div>
            <div style={{ color:"#2dd4bf", fontSize:"11px" }}>Cliente</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {nav.map(item => {
            const active = activeKey === item.key;
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)} style={{
                display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", borderRadius:"8px",
                width:"100%", textAlign:"left", background:active?"#0d9488":"transparent", border:"1px solid transparent",
                color:active?"#fff":"#71717a", cursor:"pointer", fontSize:"13px", fontWeight:active?"600":"400", fontFamily:"inherit"
              }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ padding:"16px", borderTop:"1px solid #27272a" }}>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"2px" }}>Logado como</div>
          <div style={{ color:"#e4e4e7", fontSize:"13px", fontWeight:"600" }}>{nome || "Cliente"}</div>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"10px" }}>Cliente</div>
          <button onClick={onLogout} style={{ background:"transparent", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px" }}>🚪 Sair</button>
        </div>
      </aside>
      <main style={{ flex:1, marginLeft:"220px" }}>{children}</main>
    </div>
  );
}
