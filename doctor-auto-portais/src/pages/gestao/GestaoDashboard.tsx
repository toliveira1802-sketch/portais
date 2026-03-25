import { useState } from "react";
import GestaoLayout from "../../components/GestaoLayout";

const MOCK_KPI = [
  { label:"Faturamento Mes", value:"R$ 48.320", change:"+12%", icon:"💰", color:"#22c55e", bg:"rgba(34,197,94,0.08)", border:"rgba(34,197,94,0.2)" },
  { label:"OS Abertas", value:"23", change:"+3 hoje", icon:"🔧", color:"#60a5fa", bg:"rgba(96,165,250,0.08)", border:"rgba(96,165,250,0.2)" },
  { label:"Novos Clientes", value:"8", change:"no mes", icon:"👥", color:"#a78bfa", bg:"rgba(167,139,250,0.08)", border:"rgba(167,139,250,0.2)" },
  { label:"Ticket Medio", value:"R$ 780", change:"+5%", icon:"📈", color:"#fb923c", bg:"rgba(251,146,60,0.08)", border:"rgba(251,146,60,0.2)" },
];

const MOCK_ALERTAS = [
  { tipo:"error", msg:"3 OS com prazo vencido aguardando acao" },
  { tipo:"warning", msg:"Meta de faturamento 78% atingida" },
  { tipo:"info", msg:"2 mecanicos sem OS atribuida hoje" },
];

const QUICK = [
  { label:"OS Ultimate", key:"gestao-os", color:"#7c3aed" },
  { label:"Financeiro", key:"gestao-financeiro", color:"#166534" },
  { label:"Metas", key:"gestao-metas", color:"#1d4ed8" },
  { label:"Melhorias", key:"gestao-melhorias", color:"#c2410c" },
  { label:"Operacoes", key:"gestao-operacoes", color:"#0f766e" },
  { label:"RH", key:"gestao-rh", color:"#7e22ce" },
];

export default function GestaoDashboard({ onNavigate }: { onNavigate: (k:string) => void }) {
  return (
    <div style={{ padding:"28px 32px", display:"flex", flexDirection:"column", gap:"24px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:"22px", fontWeight:"700", color:"#fff" }}>Visao Geral</h1>
          <p style={{ color:"#71717a", fontSize:"13px", marginTop:"4px" }}>Doctor Auto Prime · Dashboard de Gestao</p>
        </div>
        <button onClick={() => onNavigate("gestao-os")} style={{
          padding:"10px 18px", background:"#7c3aed", border:"none", borderRadius:"10px",
          color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer"
        }}>OS Ultimate →</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        {MOCK_KPI.map((k,i) => (
          <div key={i} style={{ background:k.bg, border:`1px solid ${k.border}`, borderRadius:"14px", padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"12px" }}>
              <span style={{ fontSize:"20px" }}>{k.icon}</span>
              <span style={{ color:"#52525b", fontSize:"11px" }}>{k.change}</span>
            </div>
            <div style={{ fontSize:"22px", fontWeight:"700", color:k.color }}>{k.value}</div>
            <div style={{ color:"#71717a", fontSize:"12px", marginTop:"4px" }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        <div style={{ background:"#111113", border:"1px solid #27272a", borderRadius:"14px", padding:"20px" }}>
          <h3 style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
            ⚠️ Alertas do Dia
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {MOCK_ALERTAS.map((a,i) => (
              <div key={i} style={{
                padding:"10px 12px", borderRadius:"8px", fontSize:"13px",
                background: a.tipo==="error"?"rgba(239,68,68,0.08)":a.tipo==="warning"?"rgba(250,204,21,0.08)":"rgba(96,165,250,0.08)",
                border: `1px solid ${a.tipo==="error"?"rgba(239,68,68,0.2)":a.tipo==="warning"?"rgba(250,204,21,0.2)":"rgba(96,165,250,0.2)"}`,
                color: a.tipo==="error"?"#fca5a5":a.tipo==="warning"?"#fde68a":"#93c5fd"
              }}>{a.msg}</div>
            ))}
          </div>
        </div>
        <div style={{ background:"#111113", border:"1px solid #27272a", borderRadius:"14px", padding:"20px" }}>
          <h3 style={{ color:"#e4e4e7", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Acesso Rapido</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
            {QUICK.map(item => (
              <button key={item.key} onClick={() => onNavigate(item.key)} style={{
                background:item.color, border:"none", borderRadius:"8px", padding:"12px",
                color:"#fff", fontSize:"12px", fontWeight:"600", cursor:"pointer", textAlign:"left"
              }}>{item.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
