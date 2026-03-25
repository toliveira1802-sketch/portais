import { ReactNode } from "react";

const nav = [
  { icon:"🔧", label:"Minhas OS", key:"mec-os" },
  { icon:"📋", label:"Checklists", key:"mec-checklist" },
  { icon:"📅", label:"Agenda", key:"mec-agenda" },
  { icon:"🚗", label:"Patio", key:"mec-patio" },
];

export default function MecanicoLayout({ children, activeKey, onNavigate, onLogout, nome }: {
  children: ReactNode;
  activeKey: string;
  onNavigate: (k: string) => void;
  onLogout: () => void;
  nome?: string;
}) {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#09090b", fontFamily:"'Inter',sans-serif", color:"#e4e4e7" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;}`}</style>
      <aside style={{ width:"220px", background:"#111113", borderRight:"1px solid #27272a", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0 }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid #27272a", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", background:"#ea580c", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"13px" }}>Doctor Auto</div>
            <div style={{ color:"#fb923c", fontSize:"11px" }}>Mecanico</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {nav.map(item => {
            const active = activeKey === item.key;
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)} style={{
                display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", borderRadius:"8px",
                width:"100%", textAlign:"left",
                background: active ? "#ea580c" : "transparent", border:"1px solid transparent",
                color: active ? "#fff" : "#71717a", cursor:"pointer", fontSize:"13px",
                fontWeight: active ? "600" : "400", fontFamily:"inherit", transition:"all 0.15s"
              }}
                onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.06)" }}
                onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background="transparent" }}
              >
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ padding:"16px", borderTop:"1px solid #27272a" }}>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"2px" }}>Logado como</div>
          <div style={{ color:"#e4e4e7", fontSize:"13px", fontWeight:"600" }}>{nome || "Mecanico"}</div>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"10px" }}>Mecanico</div>
          <button onClick={onLogout} style={{ background:"transparent", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", display:"flex", alignItems:"center", gap:"6px" }}>
            🚪 Sair
          </button>
        </div>
      </aside>
      <main style={{ flex:1, marginLeft:"220px" }}>{children}</main>
    </div>
  );
}
