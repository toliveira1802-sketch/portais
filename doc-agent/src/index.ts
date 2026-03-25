import "dotenv/config";
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { createNotionDocPage, listNotionDocPages } from "./notion.js";

// ─── Custom Tools ───────────────────────────────────────────

const createDocPage = tool(
  "create_doc_page",
  "Cria uma pagina de documentacao tecnica no Notion seguindo o template padrao do Doctor Auto Prime. Use apos analisar o codigo de um modulo/tela.",
  {
    title: z.string().describe("Nome do modulo ou tela (ex: 'Selecionar Perfil', 'Dashboard Principal')"),
    icon: z.string().describe("Emoji para o icone da pagina (ex: '👤', '📊', '🔧')"),
    status: z.enum(["Em Desenvolvimento", "Refatorado", "Concluido"]).describe("Status atual do modulo"),
    content: z.string().describe(`Conteudo da documentacao em markdown seguindo EXATAMENTE esta estrutura:

## 📸 1. Interface Atual
[Descreva o que a tela faz visualmente]

## ✅ 2. TO-DOs
- [ ] Tarefa pendente 1
- [ ] Tarefa pendente 2

## 🎯 3. Visao Geral
Objetivo do modulo em 1-2 frases.

## 🗄️ 4. Arquitetura e Banco de Dados
Tabelas usadas, campos principais, relacoes.

## 🛣️ 5. Rotas e API
- GET /api/exemplo — Descricao
- POST /api/exemplo — Descricao

## 🧠 6. Regras de Negocio
- [ ] Regra 1: descricao
- [ ] Regra 2: descricao

## 🖥️ 7. Componentes Frontend
\`\`\`
src/pages/Exemplo.tsx
src/components/ExemploCard/
src/hooks/useExemplo.ts
\`\`\`

## 🔄 8. Changelog
- [Data]: Descricao da alteracao`),
  },
  async (args) => {
    try {
      const result = await createNotionDocPage(args);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro ao criar pagina: ${error.message}` }] };
    }
  }
);

const listDocPages = tool(
  "list_doc_pages",
  "Lista todas as paginas de documentacao ja criadas no Notion.",
  {},
  async () => {
    try {
      const result = await listNotionDocPages();
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro ao listar paginas: ${error.message}` }] };
    }
  }
);

// ─── MCP Server com as tools ────────────────────────────────

const notionServer = createSdkMcpServer({
  name: "notion-doc-tools",
  tools: [createDocPage, listDocPages],
});

// ─── System Prompt ──────────────────────────────────────────

const SYSTEM_PROMPT = `Voce e um agente especializado em documentacao tecnica para o projeto Doctor Auto Prime.

## Seu Trabalho
Voce analisa codigo-fonte de modulos/telas React/TypeScript e gera documentacao tecnica estruturada no Notion.

## Fluxo de Trabalho
1. Use Read, Glob e Grep para explorar o codigo do projeto em ${process.env.PROJECT_PATH || "../doctor-auto-portais/src"}
2. Para cada modulo/tela, analise:
   - Componentes usados e estrutura de pastas
   - Rotas e chamadas de API (fetch, axios, supabase)
   - Regras de negocio (validacoes, condicionais, permissoes)
   - Tabelas do banco de dados referenciadas
   - Hooks customizados e gerenciamento de estado
   - TO-DOs e melhorias possiveis
3. Use list_doc_pages para ver o que ja foi documentado
4. Use create_doc_page para criar a documentacao no Notion

## Regras
- Documente em portugues brasileiro
- Seja tecnico mas claro
- Identifique regras de negocio a partir do codigo (if/else, validacoes, guards)
- Liste componentes com caminhos reais do projeto
- Sugira TO-DOs reais baseados no que voce ve no codigo (falta de tratamento de erro, responsividade, etc)
- Se encontrar chamadas ao Supabase, documente as tabelas envolvidas
- Nao invente rotas ou tabelas — documente apenas o que existe no codigo

## Projeto
- Stack: React 19 + TypeScript + Vite + Supabase
- Perfis: Consultor, Mecanico, Cliente, Gestao, Dev
- Cada perfil tem seu layout e rotas proprias`;

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const targetModule = process.argv[2];

  let prompt: string;

  if (targetModule) {
    prompt = `Analise o modulo/tela "${targetModule}" no projeto Doctor Auto Prime.
Leia os arquivos relevantes, entenda o que o modulo faz, e crie a documentacao tecnica no Notion usando create_doc_page.`;
  } else {
    prompt = `Faca um levantamento completo do projeto Doctor Auto Prime.
1. Primeiro, liste as paginas de documentacao que ja existem no Notion (list_doc_pages)
2. Depois, explore a estrutura do projeto com Glob e Read
3. Para cada tela/modulo principal que AINDA NAO foi documentado, analise o codigo e crie a documentacao no Notion

Comece pelo mapeamento geral e va documentando modulo a modulo.`;
  }

  const parentPageId = process.env.NOTION_PARENT_PAGE_ID!;

  console.log("🤖 Doc Agent iniciando...");
  console.log(`📁 Projeto: ${process.env.PROJECT_PATH || "../doctor-auto-portais/src"}`);
  console.log(`📝 Notion Parent: ${parentPageId}`);
  if (targetModule) console.log(`🎯 Modulo alvo: ${targetModule}`);
  console.log("─".repeat(50));

  const options = {
    cwd: process.env.PROJECT_PATH || "../doctor-auto-portais/src",
    allowedTools: ["Read", "Glob", "Grep"],
    mcpServers: { notion: notionServer },
    systemPrompt: SYSTEM_PROMPT,
    model: "claude-sonnet-4-6",
    maxTurns: 50,
    permissionMode: "bypassPermissions" as const,
    allowDangerouslySkipPermissions: true,
  };

  for await (const message of query({ prompt, options })) {
    if ("result" in message) {
      console.log("\n" + "─".repeat(50));
      console.log("✅ Resultado final:");
      console.log(message.result);
    } else if (message.type === "assistant") {
      for (const block of (message as any).content || []) {
        if (block.type === "text" && block.text) {
          process.stdout.write(block.text);
        }
      }
    }
  }
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
