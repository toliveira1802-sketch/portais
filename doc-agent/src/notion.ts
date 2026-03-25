import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID!;

// Mapeia o conteudo markdown simplificado para blocos Notion
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
          rich_text: [{ type: "text", text: { content: codeLines.join("\n") } }],
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
        heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] },
      });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] },
      });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] },
      });
      i++;
      continue;
    }

    // To-do
    if (line.startsWith("- [ ] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [{ type: "text", text: { content: line.slice(6) } }],
          checked: false,
        },
      });
      i++;
      continue;
    }
    if (line.startsWith("- [x] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: [{ type: "text", text: { content: line.slice(6) } }],
          checked: true,
        },
      });
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: line.slice(2) } }],
        },
      });
      i++;
      continue;
    }

    // Callout (custom: > **callout:** text)
    if (line.startsWith("> ")) {
      blocks.push({
        object: "block",
        type: "callout",
        callout: {
          rich_text: [{ type: "text", text: { content: line.slice(2) } }],
          icon: { emoji: "💡" },
        },
      });
      i++;
      continue;
    }

    // Paragraph (skip empty lines)
    if (line.trim()) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: line } }],
        },
      });
    }

    i++;
  }

  return blocks;
}

// Quebra em chunks de 100 blocos (limite da API do Notion)
async function appendBlocks(pageId: string, blocks: any[]) {
  const CHUNK_SIZE = 100;
  for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
    const chunk = blocks.slice(i, i + CHUNK_SIZE);
    await notion.blocks.children.append({
      block_id: pageId,
      children: chunk,
    });
  }
}

export async function createNotionDocPage(args: {
  title: string;
  icon: string;
  status: string;
  content: string;
}): Promise<string> {
  const { title, icon, status, content } = args;

  // Cria a pagina
  const page = await notion.pages.create({
    parent: { page_id: PARENT_PAGE_ID },
    icon: { type: "emoji", emoji: icon as any },
    properties: {
      title: {
        title: [{ text: { content: title } }],
      },
    },
  });

  // Header com status
  const headerBlocks: any[] = [
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: { content: `Status: ${status}\nResponsavel: Thales / Equipe de Engenharia\nData: ${new Date().toLocaleDateString("pt-BR")}\nVersao: 1.0` },
          },
        ],
        icon: { emoji: "📌" },
        color: "gray_background",
      },
    },
    { object: "block", type: "divider", divider: {} },
  ];

  // Converte o conteudo markdown em blocos Notion
  const contentBlocks = markdownToBlocks(content);

  await appendBlocks(page.id, [...headerBlocks, ...contentBlocks]);

  return `Pagina criada: ${title} — https://notion.so/${page.id.replace(/-/g, "")}`;
}

export async function listNotionDocPages(): Promise<string> {
  const response = await notion.blocks.children.list({
    block_id: PARENT_PAGE_ID,
  });

  const pages = response.results
    .filter((block: any) => block.type === "child_page")
    .map((block: any) => `- ${block.child_page.title}`);

  return pages.length > 0
    ? `Paginas existentes:\n${pages.join("\n")}`
    : "Nenhuma pagina de documentacao encontrada.";
}
