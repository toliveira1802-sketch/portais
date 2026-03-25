# Vault Structure — Thales Moreira
# Execute no PowerShell a partir da pasta onde quer criar o vault

$base = ".\ThalesVault"

$folders = @(
    "$base\00-INBOX",
    "$base\10-PROJETOS\Doctor-Auto",
    "$base\10-PROJETOS\Sophia-Hub",
    "$base\10-PROJETOS\DevHub",
    "$base\20-AREAS\Dev",
    "$base\20-AREAS\IA",
    "$base\20-AREAS\Negocios",
    "$base\30-RECURSOS\Snippets",
    "$base\30-RECURSOS\Docs",
    "$base\30-RECURSOS\Referencias",
    "$base\40-ARQUIVO",
    "$base\50-DIARIO",
    "$base\60-ESTRATEGIA\ADRs",
    "$base\60-ESTRATEGIA\Roadmaps",
    "$base\.obsidian"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    Write-Host "✓ $folder"
}

# Criar claude.md na raiz do vault
$claudeMd = Get-Content ".\claude.md" -Raw -ErrorAction SilentlyContinue
if ($claudeMd) {
    Copy-Item ".\claude.md" "$base\claude.md"
    Write-Host "✓ claude.md copiado para o vault"
}

# Criar notas de boas-vindas por projeto
$today = Get-Date -Format "yyyy-MM-dd"

$doctorAutoIndex = @"
---
tags: [projeto/doctor-auto, status/ativo]
data: $today
projeto: Doctor Auto Prime
status: ativo
---

# Doctor Auto Prime

## Visão Geral
Sistema de gestão para oficinas automotivas.

## Stack
- Frontend: React 19 + TypeScript + Vite
- Backend: Express + tRPC + Drizzle ORM
- DB: MySQL
- Deploy: Railway
- Supabase: ``acuufrgoyjwzlyhopaus`` (DOCTOR PRIME)

## Módulos
- [ ] OS (Ordem de Serviço)
- [ ] Pátio (Kanban de veículos)
- [ ] Financeiro
- [ ] Clientes / CRM
- [ ] Relatórios

## Próximos Passos
-

## Links Relacionados
- [[Sophia Hub]]
"@

$sophiaIndex = @"
---
tags: [projeto/sophia-hub, status/ativo]
data: $today
projeto: Sophia Hub
status: ativo
---

# Sophia Hub

## Visão Geral
Ecossistema de agentes de IA integrado ao Doctor Auto.

## Deploy
- URL: sophia-hub.vercel.app
- Plataforma: Vercel (serverless + cron)

## Agentes
| Agente | Função |
|--------|--------|
| Sophia | Orquestradora e relatórios |
| Simone | Inteligência interna |
| Ana | Atendimento + agendamento |
| Follow-up | Temperatura do cliente |
| Monitor | Tempo de resposta |

## Variáveis de Ambiente Críticas
- ``KOMMO_DOMAIN`` — sem trailing slash!
- Ver ``.env.example`` no repo

## Próximos Passos
-

## Links Relacionados
- [[Doctor Auto Prime]]
"@

$devhubIndex = @"
---
tags: [projeto/devhub, status/ativo]
data: $today
projeto: DevHub
status: ativo
---

# DevHub

## Visão Geral
Ferramenta de produtividade pessoal do Thales.

## Stack
- React + TypeScript + Vite + Tailwind + Zustand

## Roadmap
- [x] Fase 1: Local (MVP funcional)
- [ ] Fase 2: Supabase (sync em nuvem)
- [ ] Fase 3: Tauri (app desktop)

## Próximos Passos
-
"@

Set-Content "$base\10-PROJETOS\Doctor-Auto\[PROJETO] Doctor Auto Prime.md" $doctorAutoIndex -Encoding UTF8
Set-Content "$base\10-PROJETOS\Sophia-Hub\[PROJETO] Sophia Hub.md" $sophiaIndex -Encoding UTF8
Set-Content "$base\10-PROJETOS\DevHub\[PROJETO] DevHub.md" $devhubIndex -Encoding UTF8

Write-Host ""
Write-Host "Vault criado em: $base"
Write-Host "Abra a pasta no Obsidian como novo vault."
