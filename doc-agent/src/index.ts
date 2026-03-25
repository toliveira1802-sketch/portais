import "dotenv/config";
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import {
  createNotionDocPage,
  updateNotionDocPage,
  listNotionDocPages,
  createProjectOverview,
  addChangelogEntry,
} from "./notion.js";

// ─── Tool: Criar Pagina de Doc ──────────────────────────────

const createDocPage = tool(
  "create_doc_page",
  "Cria uma NOVA pagina de documentacao tecnica no Notion. Use apos analisar o codigo de um modulo/tela.",
  {
    title: z.string().describe("Nome do modulo ou tela (ex: 'Selecionar Perfil')"),
    icon: z.string().describe("Emoji para icone (ex: '👤', '📊', '🔧')"),
    status: z.enum(["Em Desenvolvimento", "Refatorado", "Concluido"]),
    content: z.string().describe(`Markdown seguindo a estrutura:
## 📸 1. Interface Atual
## ✅ 2. TO-DOs
## 🎯 3. Visao Geral
## 🗄️ 4. Arquitetura e Banco de Dados
## 🛣️ 5. Rotas e API
## 🧠 6. Regras de Negocio
## 🖥️ 7. Componentes Frontend
## 🔄 8. Changelog`),
  },
  async (args) => {
    try {
      const result = await createNotionDocPage(args);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro: ${error.message}` }] };
    }
  }
);

// ─── Tool: Atualizar Pagina Existente ───────────────────────

const updateDocPage = tool(
  "update_doc_page",
  "Atualiza uma pagina de documentacao JA EXISTENTE no Notion. Substitui todo o conteudo. Use quando a doc esta desatualizada em relacao ao codigo.",
  {
    title: z.string().describe("Titulo EXATO da pagina existente no Notion"),
    status: z.enum(["Em Desenvolvimento", "Refatorado", "Concluido"]),
    content: z.string().describe("Novo conteudo completo em markdown (mesma estrutura do create_doc_page)"),
  },
  async (args) => {
    try {
      const result = await updateNotionDocPage(args);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro: ${error.message}` }] };
    }
  }
);

// ─── Tool: Listar Paginas ───────────────────────────────────

const listDocPages = tool(
  "list_doc_pages",
  "Lista todas as paginas de documentacao ja criadas no Notion.",
  {},
  async () => {
    try {
      const result = await listNotionDocPages();
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro: ${error.message}` }] };
    }
  }
);

// ─── Tool: Visao Geral do Projeto ───────────────────────────

const projectOverview = tool(
  "project_overview",
  "Cria ou atualiza a pagina 'Visao Geral do Projeto' com resumo, diagrama mermaid de arquitetura, lista de modulos e debito tecnico. Use apos analisar TODOS os modulos.",
  {
    summary: z.string().describe("Resumo do projeto em 3-5 paragrafos"),
    modules: z.string().describe("Lista markdown de todos os modulos com status (- **Nome** — descricao [Status])"),
    mermaid_diagram: z.string().describe("Diagrama mermaid da arquitetura (flowchart, sem as crases de codigo)"),
    tech_debt: z.string().describe("Lista de debitos tecnicos e melhorias sugeridas"),
  },
  async (args) => {
    try {
      const result = await createProjectOverview(args);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro: ${error.message}` }] };
    }
  }
);

// ─── Tool: Adicionar Changelog ──────────────────────────────

const addChangelog = tool(
  "add_changelog",
  "Adiciona uma entrada de changelog no final de uma pagina de documentacao existente. Use quando detectar mudancas no codigo que a doc ja cobre.",
  {
    page_title: z.string().describe("Titulo EXATO da pagina no Notion"),
    entry: z.string().describe("Descricao da mudanca (ex: 'Adicionado hook useAuth para controle de sessao')"),
  },
  async (args) => {
    try {
      const result = await addChangelogEntry(args);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error: any) {
      return { content: [{ type: "text" as const, text: `Erro: ${error.message}` }] };
    }
  }
);

// ─── MCP Server ─────────────────────────────────────────────

const notionServer = createSdkMcpServer({
  name: "notion-doc-tools",
  tools: [createDocPage, updateDocPage, listDocPages, projectOverview, addChangelog],
});

// ─── System Prompt ──────────────────────────────────────────

const PROJECT_PATH = process.env.PROJECT_PATH || "../doctor-auto-portais/src";

const SYSTEM_PROMPT = `Voce e um agente especializado em documentacao tecnica para o projeto Doctor Auto Prime.

## Seu Trabalho
Analisa codigo-fonte React/TypeScript e gera documentacao tecnica estruturada no Notion.

## Tools Disponiveis
- **Read/Glob/Grep** — explorar codigo do projeto
- **create_doc_page** — criar nova doc de modulo no Notion
- **update_doc_page** — atualizar doc existente (reescreve conteudo)
- **list_doc_pages** — listar docs ja criadas
- **project_overview** — criar/atualizar visao geral com diagrama mermaid
- **add_changelog** — adicionar entrada de changelog numa doc existente

## Comandos do Usuario
O usuario pode pedir:
- "doc <modulo>" → Analisa e documenta um modulo especifico
- "doc all" → Documenta todos os modulos
- "update <modulo>" → Atualiza a doc de um modulo comparando com o codigo atual
- "overview" → Gera a visao geral do projeto com diagrama
- "audit" → Compara docs existentes com o codigo e reporta o que esta desatualizado
- "scan-todos" → Varre o codigo procurando TODO, FIXME, HACK e gera relatorio
- "scan-routes" → Mapeia todas as rotas do App.tsx e documenta
- "scan-supabase" → Encontra todas as chamadas ao Supabase e documenta tabelas

## Fluxo de Trabalho
1. Use Glob para mapear arquivos relevantes
2. Use Read para ler o conteudo dos arquivos
3. Use Grep para buscar padroes especificos (supabase.from, useEffect, TODO, etc)
4. Analise o codigo e identifique:
   - Componentes e estrutura de pastas
   - Rotas e chamadas de API (supabase.from, fetch)
   - Regras de negocio (if/else, validacoes, guards, roles)
   - Hooks customizados e gerenciamento de estado
   - TO-DOs, FIXMEs e melhorias necessarias
   - Dependencias entre modulos
5. Use as tools do Notion para criar/atualizar docs

## Regras
- Documente em portugues brasileiro
- Seja tecnico mas claro
- Identifique regras de negocio a partir do codigo real
- Liste componentes com caminhos REAIS do projeto
- Sugira TO-DOs baseados em problemas REAIS no codigo
- Nao invente rotas, tabelas ou funcionalidades — documente apenas o que EXISTE
- Use tabelas markdown (| col | col |) para dados tabulares
- Gere diagramas mermaid precisos baseados nas importacoes reais

## Projeto
- Stack: React 19 + TypeScript + Vite + Supabase
- Perfis: Consultor, Mecanico, Cliente, Gestao, Dev
- Cada perfil tem seu layout proprio em src/components/
- Paginas organizadas por perfil em src/pages/
- Auth via Supabase em src/contexts/AuthContext.tsx
- Caminho: ${PROJECT_PATH}`;

// ─── CLI ────────────────────────────────────────────────────

function buildPrompt(args: string[]): string {
  const command = args[0]?.toLowerCase();
  const target = args.slice(1).join(" ");

  switch (command) {
    case "overview":
      return `Faca um levantamento completo do projeto Doctor Auto Prime:
1. Explore toda a estrutura com Glob
2. Leia o App.tsx para entender as rotas
3. Identifique todos os modulos/telas
4. Crie a visao geral do projeto usando project_overview com:
   - Resumo do que o sistema faz
   - Diagrama mermaid da arquitetura (perfis, layouts, rotas, supabase)
   - Lista de todos os modulos com status
   - Debitos tecnicos identificados`;

    case "audit":
      return `Faca uma auditoria da documentacao:
1. Use list_doc_pages para ver as docs existentes
2. Explore o codigo com Glob e Read
3. Compare o que esta documentado com o estado atual do codigo
4. Para cada pagina existente, verifique se:
   - Componentes listados ainda existem
   - Rotas/APIs mudaram
   - Novas regras de negocio foram adicionadas
   - Novos componentes foram criados
5. Reporte o que esta desatualizado e use update_doc_page para corrigir`;

    case "update":
      if (!target) return "Especifique o modulo. Ex: npm run doc -- update SelecionarPerfil";
      return `Atualize a documentacao do modulo "${target}":
1. Use list_doc_pages para encontrar a pagina existente
2. Leia o codigo atual do modulo
3. Compare com o que esta documentado
4. Use update_doc_page para reescrever a doc com informacoes atualizadas
5. Adicione uma entrada no changelog sobre o que mudou`;

    case "scan-todos":
      return `Varra todo o projeto procurando comentarios TODO, FIXME, HACK, XXX e @todo:
1. Use Grep para buscar esses padroes em todos os arquivos .ts e .tsx
2. Agrupe por arquivo/modulo
3. Crie uma pagina no Notion chamada "TODOs e Debito Tecnico" com create_doc_page usando:
   - Icone: ⚠️
   - Lista organizada por modulo
   - Prioridade sugerida (critico, medio, baixo)
   - Status: Em Desenvolvimento`;

    case "scan-routes":
      return `Mapeie todas as rotas da aplicacao:
1. Leia o App.tsx para encontrar todas as Route definitions
2. Para cada rota, identifique: path, componente, layout, perfil necessario
3. Crie uma pagina "Mapa de Rotas" no Notion com create_doc_page usando:
   - Icone: 🗺️
   - Tabela com todas as rotas (| Rota | Componente | Layout | Perfil |)
   - Diagrama mermaid do fluxo de navegacao
   - Status: Em Desenvolvimento`;

    case "scan-supabase":
      return `Mapeie todas as interacoes com o Supabase:
1. Use Grep para buscar "supabase" em todos os arquivos .ts e .tsx
2. Identifique: tabelas acessadas (supabase.from), auth calls, realtime subscriptions
3. Crie uma pagina "Integracao Supabase" no Notion com create_doc_page usando:
   - Icone: 🗄️
   - Tabela de entidades (| Tabela | Operacoes | Usado em |)
   - Auth flow documentado
   - Status: Em Desenvolvimento`;

    case "all":
      return `Documente TODOS os modulos do projeto:
1. Use list_doc_pages para ver o que ja foi documentado
2. Explore o projeto inteiro com Glob
3. Para cada tela/modulo que AINDA NAO foi documentado, analise e crie a doc
4. Ao final, crie/atualize a visao geral do projeto com project_overview
Comece pelo mapeamento geral e va modulo a modulo.`;

    default:
      if (command) {
        const moduleName = args.join(" ");
        return `Analise o modulo/tela "${moduleName}" no projeto Doctor Auto Prime.
Leia os arquivos relevantes, entenda o que faz, e crie a documentacao no Notion usando create_doc_page.`;
      }
      return `Mostre ao usuario os comandos disponiveis:
- npm run doc -- <NomeDoModulo>  → Documenta um modulo especifico
- npm run doc -- all             → Documenta todos os modulos
- npm run doc -- overview        → Gera visao geral com diagrama
- npm run doc -- update <modulo> → Atualiza doc existente
- npm run doc -- audit           → Compara docs vs codigo atual
- npm run doc -- scan-todos      → Varre TODOs/FIXMEs no codigo
- npm run doc -- scan-routes     → Mapeia todas as rotas
- npm run doc -- scan-supabase   → Mapeia uso do Supabase`;
  }
}

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const prompt = buildPrompt(args);

  console.log("🤖 Doc Agent — Doctor Auto Prime");
  console.log(`📁 ${PROJECT_PATH}`);
  console.log(`🎯 Comando: ${args.length > 0 ? args.join(" ") : "(help)"}`);
  console.log("─".repeat(50));

  if (args.length === 0) {
    console.log(`
Comandos disponiveis:

  npm run doc -- <NomeDoModulo>     Documenta um modulo especifico
  npm run doc -- all                Documenta TODOS os modulos
  npm run doc -- overview           Visao geral + diagrama mermaid
  npm run doc -- update <modulo>    Atualiza doc existente
  npm run doc -- audit              Compara docs vs codigo atual
  npm run doc -- scan-todos         Varre TODO/FIXME/HACK no codigo
  npm run doc -- scan-routes        Mapeia todas as rotas do app
  npm run doc -- scan-supabase      Mapeia uso do Supabase

Exemplos:
  npm run doc -- SelecionarPerfil
  npm run doc -- update "Dashboard Principal"
  npm run doc -- all
`);
    return;
  }

  const options = {
    cwd: PROJECT_PATH,
    allowedTools: ["Read", "Glob", "Grep"],
    mcpServers: { notion: notionServer },
    systemPrompt: SYSTEM_PROMPT,
    model: "claude-sonnet-4-6",
    maxTurns: 80,
    permissionMode: "bypassPermissions" as const,
    allowDangerouslySkipPermissions: true,
  };

  for await (const message of query({ prompt, options })) {
    if ("result" in message) {
      console.log("\n" + "─".repeat(50));
      console.log("✅ Concluido!");
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
