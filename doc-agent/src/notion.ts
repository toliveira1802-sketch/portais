import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID!;

// ─── Markdown → Notion Blocks ───────────────────────────────

function richText(text: string, bold = false, code = false, color?: string): any {
  const annotations: any = {};
  if (bold) annotations.bold = true;
  if (code) annotations.code = true;
  if (color) annotations.color = color;
  return {
    type: "text",
    text: { content: text },
    annotations: Object.keys(annotations).length > 0 ? annotations : undefined,
  };
}

function markdownToBlocks(content: string): any[] {
  const lines = content.split("\n");
  const blocks: any[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Bloco de codigo
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "plain text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        object: "block",
        type: "code",
        code: {
          rich_text: [richText(codeLines.join("\n"))],
          language: lang,
        },
      });
      i++;
      continue;
    }

    // Divider
    if (line.trim() === "---") {
      blocks.push({ object: "block", type: "divider", divider: {} });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: [richText(line.slice(4))] },
      });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [richText(line.slice(3))] },
      });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [richText(line.slice(2))] },
      });
      i++;
      continue;
    }

    // Numbered list
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [richText(numberedMatch[2])],
        },
      });
      i++;
      continue;
    }

    // To-do
    if (line.startsWith("- [ ] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: { rich_text: [richText(line.slice(6))], checked: false },
      });
      i++;
      continue;
    }
    if (line.startsWith("- [x] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: { rich_text: [richText(line.slice(6))], checked: true },
      });
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [richText(line.slice(2))] },
      });
      i++;
      continue;
    }

    // Callout (> text)
    if (line.startsWith("> ")) {
      blocks.push({
        object: "block",
        type: "callout",
        callout: {
          rich_text: [richText(line.slice(2))],
          icon: { emoji: "💡" },
        },
      });
      i++;
      continue;
    }

    // Table (| col1 | col2 |)
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|") && lines[i].endsWith("|")) {
        const row = lines[i]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        // Skip separator rows (|---|---|)
        if (!row.every((c) => /^-+$/.test(c))) {
          tableRows.push(row);
        }
        i++;
      }
      if (tableRows.length > 0) {
        const width = Math.max(...tableRows.map((r) => r.length));
        blocks.push({
          object: "block",
          type: "table",
          table: {
            table_width: width,
            has_column_header: true,
            has_row_header: false,
            children: tableRows.map((row) => ({
              type: "table_row",
              table_row: {
                cells: Array.from({ length: width }, (_, ci) => [
                  richText(row[ci] || ""),
                ]),
              },
            })),
          },
        });
      }
      continue;
    }

    // Paragraph (skip empty lines)
    if (line.trim()) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [richText(line)] },
      });
    }

    i++;
  }

  return blocks;
}

// ─── Helpers ────────────────────────────────────────────────

async function appendBlocks(pageId: string, blocks: any[]) {
  const CHUNK_SIZE = 100;
  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    await notion.blocks.children.append({ block_id: pageId, children: chunk });
  }
}

async function deleteAllBlocks(pageId: string) {
  const response = await notion.blocks.children.list({ block_id: pageId });
  for (const block of response.results) {
    await notion.blocks.delete({ block_id: block.id });
  }
}

async function findPageByTitle(title: string): Promise<string | null> {
  const response = await notion.blocks.children.list({ block_id: PARENT_PAGE_ID });
  for (const block of response.results) {
    if ((block as any).type === "child_page" && (block as any).child_page.title === title) {
      return block.id;
    }
  }
  return null;
}

// ─── Exports ────────────────────────────────────────────────

export async function createNotionDocPage(args: {
  title: string;
  icon: string;
  status: string;
  content: string;
}): Promise<string> {
  const { title, icon, status, content } = args;

  const page = await notion.pages.create({
    parent: { page_id: PARENT_PAGE_ID },
    icon: { type: "emoji", emoji: icon as any },
    properties: {
      title: { title: [{ text: { content: title } }] },
    },
  });

  const headerBlocks: any[] = [
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          richText(
            `Status: ${status}\nResponsavel: Thales / Equipe de Engenharia\nData: ${new Date().toLocaleDateString("pt-BR")}\nVersao: 1.0`
          ),
        ],
        icon: { emoji: "📌" },
        color: "gray_background",
      },
    },
    { object: "block", type: "divider", divider: {} },
  ];

  const contentBlocks = markdownToBlocks(content);
  await appendBlocks(page.id, [...headerBlocks, ...contentBlocks]);

  return `Pagina criada: ${title} — https://notion.so/${page.id.replace(/-/g, "")}`;
}

export async function updateNotionDocPage(args: {
  title: string;
  status: string;
  content: string;
}): Promise<string> {
  const { title, status, content } = args;

  const pageId = await findPageByTitle(title);
  if (!pageId) {
    return `Pagina "${title}" nao encontrada. Use create_doc_page para criar.`;
  }

  // Limpa conteudo antigo e reescreve
  await deleteAllBlocks(pageId);

  const headerBlocks: any[] = [
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          richText(
            `Status: ${status}\nResponsavel: Thales / Equipe de Engenharia\nData: ${new Date().toLocaleDateString("pt-BR")}\nVersao: 1.1 (atualizado)`
          ),
        ],
        icon: { emoji: "📌" },
        color: "gray_background",
      },
    },
    { object: "block", type: "divider", divider: {} },
  ];

  const contentBlocks = markdownToBlocks(content);
  await appendBlocks(pageId, [...headerBlocks, ...contentBlocks]);

  return `Pagina atualizada: ${title} — https://notion.so/${pageId.replace(/-/g, "")}`;
}

export async function listNotionDocPages(): Promise<string> {
  const response = await notion.blocks.children.list({ block_id: PARENT_PAGE_ID });

  const pages = response.results
    .filter((block: any) => block.type === "child_page")
    .map((block: any) => `- ${block.child_page.title} (id: ${block.id})`);

  return pages.length > 0
    ? `Paginas existentes:\n${pages.join("\n")}`
    : "Nenhuma pagina de documentacao encontrada.";
}

export async function createProjectOverview(args: {
  summary: string;
  modules: string;
  mermaid_diagram: string;
  tech_debt: string;
}): Promise<string> {
  const { summary, modules, mermaid_diagram, tech_debt } = args;

  // Procura se ja existe
  const existingId = await findPageByTitle("Visao Geral do Projeto");
  const pageId = existingId || (
    await notion.pages.create({
      parent: { page_id: PARENT_PAGE_ID },
      icon: { type: "emoji", emoji: "🗺️" as any },
      properties: {
        title: { title: [{ text: { content: "Visao Geral do Projeto" } }] },
      },
    })
  ).id;

  if (existingId) await deleteAllBlocks(existingId);

  const blocks = [
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [richText(`Gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")} pelo Doc Agent`)],
        icon: { emoji: "🤖" },
        color: "blue_background",
      },
    },
    { object: "block", type: "divider", divider: {} },
    ...markdownToBlocks(`# Resumo\n${summary}\n\n---\n\n# Arquitetura Geral\n\`\`\`mermaid\n${mermaid_diagram}\n\`\`\`\n\n---\n\n# Modulos do Sistema\n${modules}\n\n---\n\n# Debito Tecnico e Melhorias\n${tech_debt}`),
  ];

  await appendBlocks(pageId, blocks);

  return `Visao geral ${existingId ? "atualizada" : "criada"}: https://notion.so/${pageId.replace(/-/g, "")}`;
}

export async function addChangelogEntry(args: {
  page_title: string;
  entry: string;
}): Promise<string> {
  const { page_title, entry } = args;

  const pageId = await findPageByTitle(page_title);
  if (!pageId) return `Pagina "${page_title}" nao encontrada.`;

  const blocks = [
    { object: "block", type: "divider", divider: {} },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          richText(`${new Date().toLocaleDateString("pt-BR")}: `, true),
          richText(entry),
        ],
      },
    },
  ];

  await appendBlocks(pageId, blocks);

  return `Changelog adicionado na pagina "${page_title}": ${entry}`;
}
