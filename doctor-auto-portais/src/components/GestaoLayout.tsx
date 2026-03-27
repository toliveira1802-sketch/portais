import { ReactNode, useState } from "react";

const navPrincipal = [
  { icon:"📊", label:"Visao Geral", key:"gestao-visao" },
  { icon:"🔧", label:"OS Ultimate", key:"gestao-os" },
  { icon:"🎯", label:"Metas", key:"gestao-metas" },
  { icon:"💡", label:"Melhorias", key:"gestao-melhorias" },
];
const navFinanceiro = [
  { icon:"💰", label:"Financeiro", key:"gestao-financeiro" },
  { icon:"🛒", label:"Comercial", key:"gestao-comercial" },
  { icon:"🏭", label:"Fornecedores", key:"gestao-fornecedores" },
];
const navOperacoes = [
  { icon:"⚙️", label:"Operacoes", key:"gestao-operacoes" },
  { icon:"👥", label:"RH", key:"gestao-rh" },
  { icon:"🖥️", label:"Tecnologia", key:"gestao-tecnologia" },
  { icon:"🚗", label:"Veiculos Orfaos", key:"gestao-orfaos" },
];

export default function GestaoLayout({ children, activeKey, onNavigate, onLogout, userName }: {
  children: ReactNode;
  activeKey: string;
  onNavigate: (k: string) => void;
  onLogout: () => void;
  userName?: string;
}) {
  const [sec, setSec] = useState<Record<string,boolean>>({ fin:true, ops:true });

  const Item = ({ item }: { item: any }) => {
    const active = activeKey === item.key;
    return (
      <button onClick={() => onNavigate(item.key)} style={{
        display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px",
        borderRadius:"8px", width:"100%", textAlign:"left",
        background: active ? "#7c3aed" : "transparent",
        border:"1px solid transparent",
        color: active ? "#fff" : "#71717a",
        cursor:"pointer", fontSize:"13px", fontWeight: active ? "600" : "400",
        fontFamily:"inherit", transition:"all 0.15s"
      }}
        onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.06)" }}
        onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background="transparent" }}
      >
        <span style={{ fontSize:"15px", width:"18px" }}>{item.icon}</span>
        <span>{item.label}</span>
      </button>
    );
  };

  const Section = ({ k, title, items }: { k:string; title:string; items:any[] }) => (
    <div>
      <button onClick={() => setSec(p => ({...p,[k]:!p[k]}))}
        style={{ width:"100%", display:"flex", justifyContent:"space-between", padding:"6px 12px 4px",
          color:"#52525b", fontSize:"11px", fontWeight:"600", letterSpacing:"1px", textTransform:"uppercase",
          background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
        <span>{title}</span><span>{sec[k] ? "▾" : "▸"}</span>
      </button>
      {sec[k] && (
        <div style={{ paddingLeft:"8px", borderLeft:"1px solid #27272a", marginLeft:"12px", marginBottom:"4px" }}>
          {items.map(item => <Item key={item.key} item={item} />)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#09090b", fontFamily:"'Inter',sans-serif", color:"#e4e4e7" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} button{font-family:inherit;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}`}</style>
      <aside style={{ width:"220px", background:"#111113", borderRight:"1px solid #27272a", display:"flex", flexDirection:"column", position:"fixed", left:0, top:0, bottom:0, overflowY:"auto" }}>
        <div style={{ padding:"20px 16px", borderBottom:"1px solid #27272a", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", background:"#7c3aed", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>DA</div>
          <div>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"13px" }}>Doctor Auto</div>
            <div style={{ color:"#a78bfa", fontSize:"11px" }}>Gestao</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 8px", display:"flex", flexDirection:"column", gap:"2px" }}>
          {navPrincipal.map(item => <Item key={item.key} item={item} />)}
          <div style={{ marginTop:"8px" }}><Section k="fin" title="Financeiro" items={navFinanceiro} /></div>
          <div style={{ marginTop:"4px" }}><Section k="ops" title="Operacoes" items={navOperacoes} /></div>
        </nav>
        <div style={{ padding:"16px", borderTop:"1px solid #27272a" }}>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"2px" }}>Logado como</div>
          <div style={{ color:"#e4e4e7", fontSize:"13px", fontWeight:"600" }}>{userName || "Gestor"}</div>
          <div style={{ color:"#52525b", fontSize:"11px", marginBottom:"10px" }}>Doctor Auto Prime</div>
          <button onClick={onLogout} style={{ background:"transparent", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"13px", display:"flex", alignItems:"center", gap:"6px" }}>
            🚪 Sair
          </button>
        </div>
      </aside>
      <main style={{ flex:1, marginLeft:"220px", display:"flex", flexDirection:"column" }}>
        {children}
      </main>
    </div>
  );
}
