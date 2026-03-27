const portais = [
  { key:"consultor", label:"Consultor", icon:"🔧", cor:"#1d4ed8", sub:"Atendimento e OS" },
  { key:"gestao", label:"Gestao", icon:"📊", cor:"#7c3aed", sub:"Gerenciamento" },
  { key:"mecanico", label:"Mecanico", icon:"⚙️", cor:"#ea580c", sub:"Execucao de servicos" },
  { key:"colaborador", label:"Colaborador", icon:"👷", cor:"#0891b2", sub:"Ponto, OS e holerite" },
  { key:"dev", label:"Developer", icon:"💻", cor:"#10b981", sub:"Administracao do sistema" },
]

export default function SelecionarPerfil({ onSelect }: { onSelect: (key: string) => void }) {
  return (
    <div style={{ minHeight:"100vh", background:"#09090b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(29,78,216,0.1), transparent)", pointerEvents:"none" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:"500px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", marginBottom:"24px" }}>
            <div style={{ width:"44px", height:"44px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:"900", color:"#fff" }}>DA</div>
            <div style={{ textAlign:"left" }}>
              <div style={{ color:"#fff", fontWeight:"700", fontSize:"18px" }}>Doctor Auto</div>
              <div style={{ color:"#52525b", fontSize:"12px" }}>Sistema de Gestao</div>
            </div>
          </div>
          <h1 style={{ color:"#fff", fontSize:"24px", fontWeight:"700", marginBottom:"8px" }}>Acessar Sistema</h1>
          <p style={{ color:"#71717a", fontSize:"14px" }}>Selecione seu perfil para continuar</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
          {portais.map(p => (
            <button key={p.key} onClick={() => onSelect(p.key)} style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:"16px", padding:"24px 20px", cursor:"pointer", textAlign:"left",
              transition:"all 0.2s", fontFamily:"inherit"
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `${p.cor}15`
                ;(e.currentTarget as HTMLElement).style.borderColor = `${p.cor}40`
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"
                ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
              }}
            >
              <div style={{ fontSize:"28px", marginBottom:"12px" }}>{p.icon}</div>
              <div style={{ color:"#f4f4f5", fontWeight:"600", fontSize:"15px", marginBottom:"4px" }}>{p.label}</div>
              <div style={{ color:"#71717a", fontSize:"12px" }}>{p.sub}</div>
            </button>
          ))}
        </div>
        <p style={{ textAlign:"center", color:"#3f3f46", fontSize:"12px", marginTop:"32px" }}>
          Problemas de acesso? Contate a administracao.
        </p>
      </div>
    </div>
  )
}
