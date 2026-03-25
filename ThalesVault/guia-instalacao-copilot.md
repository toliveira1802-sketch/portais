# Guia de Instalação — Obsidian Copilot

## O que você vai ter no final

- IA dentro do Obsidian (PC e celular)
- Chat que conhece seus projetos (Doctor Auto, Sophia Hub, DevHub)
- Vault QA: perguntar sobre qualquer nota do vault
- Funciona com a API da Anthropic (Claude) — sem custo fixo, paga só por uso

---

## Passo 1 — Instalar o plugin

1. Abra o Obsidian com o vault ThalesVault
2. Vá em **Settings → Community plugins**
3. Clique em **Turn on community plugins** (se ainda não estiver ativo)
4. Clique em **Browse**
5. Pesquise: `Copilot`
6. Instale o plugin **"Copilot"** (autor: Logan Yang)
7. Ative o plugin (toggle)

---

## Passo 2 — Conectar a API da Anthropic

1. Acesse: https://console.anthropic.com/settings/keys
2. Crie uma API key (se não tiver)
3. Copie a key
4. No Obsidian: **Settings → Copilot → Basic Settings → API Keys → Set Keys**
5. Cole a key no campo **Anthropic**
6. Clique em **Verify** e depois **Save**

### Configurar o modelo padrão
- Default Chat Model: `claude-sonnet-4-20250514`
- Motivo: melhor custo-benefício, rápido, capaz

---

## Passo 3 — Adicionar o System Prompt personalizado

O arquivo `thales-system-prompt.md` já está na pasta certa dentro do vault.

Para ativar:
1. **Settings → Copilot → Advanced**
2. Em **Custom System Prompt**, selecione o arquivo `thales-system-prompt.md`
3. Salve

Agora o Copilot vai responder sabendo quem você é, quais são seus projetos e como você quer que ele se comporte.

---

## Passo 4 — Ativar Vault QA (chat com suas notas)

1. **Settings → Copilot → QA Settings**
2. **Auto-Index Strategy**: `ON MODE SWITCH` (recomendado)
3. **Embedding Model**: `text-embedding-3-small` (OpenAI) — mais barato — ou `claude` se preferir manter tudo na Anthropic
4. Clique em **Index Vault** pela primeira vez
5. Aguarde indexar (depende do tamanho do vault)

Para usar: no chat do Copilot, troque o modo para **Vault QA** e pergunte qualquer coisa sobre suas notas.

---

## Passo 5 — Configurar no celular

1. Baixe o **Obsidian** na App Store ou Play Store
2. Configure a sincronização (escolha uma opção):

### Opção A — Obsidian Sync (mais fácil, $5/mês)
- Settings → Sync → Criar conta Obsidian
- Ativa o sync no PC e no celular
- Pronto, tudo sincroniza automaticamente

### Opção B — Google Drive (gratuito, mais trabalhoso)
- PC: salva o vault dentro do Google Drive
- Android: instale o app **DriveSync** e aponte para a pasta do vault
- iOS: use o **Working Copy** ou acesso manual pelo Files

### Copilot no celular
- Após sincronizar, o plugin Copilot funciona normalmente no app mobile
- O system prompt personalizado também funciona
- Vault QA disponível — reindexar se necessário

---

## Atalhos úteis

| Ação | Como fazer |
|------|-----------|
| Abrir chat do Copilot | Ícone na barra lateral esquerda |
| Trocar modo (Chat / Vault QA) | Dropdown no topo do chat |
| Reindexar vault | Command palette → "Copilot: Index vault" |
| Trocar system prompt | Ícone de engrenagem acima do input do chat |
| Resumir nota atual | Command palette → "Copilot: Summarize" |

---

## Custo estimado

Com uso moderado (30-50 mensagens/dia):
- Chat com Claude Sonnet: ~$2-5/mês
- Embeddings para Vault QA: centavos

Bem mais barato que qualquer assinatura mensal.

---

## Próximos passos após instalar

1. Teste o chat pedindo "crie um log de hoje"
2. Indexe o vault e teste o Vault QA: "quais são meus projetos ativos?"
3. Sincronize com o celular
4. Itere o `thales-system-prompt.md` conforme for usando
