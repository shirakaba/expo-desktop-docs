import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";

export const metadata = createMetadata({
  title: {
    template: "%s | Expo Desktop",
    default: "Expo Desktop",
  },
  description:
    "Documentation for creating, building, and shipping Expo apps on macOS and Windows.",
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      githubUrl="https://github.com/shirakaba/expo-desktop"
    >
      {children}
    </DocsLayout>
  );
}
