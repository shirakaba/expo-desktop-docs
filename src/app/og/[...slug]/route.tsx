import { ImageResponse } from "next/og";

import { DesktopLogo } from "@/components/desktop-logo";
import { getPageImage, source } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: Array<string> }> },
) {
  const { slug } = await context.params;
  const pageSlug = slug.at(-1) === "image.png" ? slug.slice(0, -1) : slug;
  const page = source.getPage(pageSlug);
  if (!page) return new Response("Not found", { status: 404 });

  const section =
    pageSlug[0] === "cli"
      ? "CLI REFERENCE"
      : pageSlug[0] === "guides"
        ? "GUIDES"
        : "DOCUMENTATION";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        backgroundColor: "#0D172B",
        color: "#EDF6FF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <DesktopLogo width={64} height={64} />
        <div style={{ display: "flex", fontSize: 34 }}>Expo Desktop</div>
      </div>
      <DesktopLogo
        width={430}
        height={430}
        style={{
          position: "absolute",
          right: -80,
          bottom: -100,
          opacity: 0.13,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "950px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: "4px",
            color: "#50D8F0",
          }}
        >
          {section}
        </div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.1 }}>
          {page.data.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            lineHeight: 1.4,
            color: "#AEBFD9",
          }}
        >
          {page.data.description ?? "Expo apps for macOS and Windows."}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 20, color: "#AEBFD9" }}>
        iOS · Android · macOS · Windows · Web
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return source
    .getPages()
    .map((page) => ({ slug: getPageImage(page).segments }));
}
