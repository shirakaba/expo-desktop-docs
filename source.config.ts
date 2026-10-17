import { remarkAdmonition } from "fumadocs-core/mdx-plugins";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import convert from "npm-to-yarn";

// Convert each command separately so comments, directory changes, and continued
// arguments survive in multi-command examples.
function convertCommands(command: string, manager: "npm" | "pnpm" | "bun") {
  return command.replace(/^(?:npm|npx) .+$/gm, (line) =>
    convert(line, manager),
  );
}

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkAdmonition],
    remarkNpmOptions: {
      persist: { id: "package-manager" },
      packageManagers: [
        { name: "npm", command: (command) => convertCommands(command, "npm") },
        {
          name: "pnpm",
          command: (command) => convertCommands(command, "pnpm"),
        },
        { name: "bun", command: (command) => convertCommands(command, "bun") },
      ],
    },
    rehypeCodeOptions: {
      langs: [
        "ts",
        "js",
        "html",
        "tsx",
        "mdx",
        "objective-cpp",
        "bash",
        "json",
        "powershell",
        "xml",
      ],
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
});
