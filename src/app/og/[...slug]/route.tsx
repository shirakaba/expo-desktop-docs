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

  const height = 630;
  const logoSize = height / 2;
  const minTextOpacity = 0.33;
  const lines = pageSlug.map((segment, i) => {
    const ancestor = source.getPage(pageSlug.slice(0, i + 1));
    // Folders such as Guides have a title but no index page.
    return (
      ancestor?.data.title ??
      segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll("-", " ")
    );
  });

  const hierarchyFontSize = lines.length === 1 ? 72 : 56;
  const hierarchyIndent = 56;
  const hierarchyGap = 16;
  const hierarchyStalkOffset = 20;
  const hierarchyStalkGap = 16;
  const hierarchyBranchGap = 16;
  const hierarchyLineHeight = hierarchyFontSize * 1.2;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "40px",
        backgroundColor: "#0D172B",
        fontFamily:
          "'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        rowGap: "16px",
      }}
    >
      <DesktopLogo
        width={logoSize}
        height={logoSize}
        style={{
          position: "absolute",
          top: (height - logoSize) / 2,
          right: (height - logoSize) / 4,
          opacity: 1,
        }}
      />

      <div
        style={{
          display: "flex",
          fontSize: "74px",
          color: "#EDF6FF",
        }}
      >
        Expo Desktop
      </div>

      {/* Align the hierarchy to the vertical center of the remaining space */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {lines.length ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              paddingLeft: "4px",
              rowGap: hierarchyGap,
            }}
          >
            {lines.map((text, i, acc) => {
              const opacity =
                minTextOpacity + ((i + 1) / acc.length) * (1 - minTextOpacity);
              const branchColor = `rgba(237,246,255,${opacity - 0.2})`;

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    position: "relative",
                    alignItems: "center",
                    paddingLeft: i * hierarchyIndent,
                    height: hierarchyLineHeight,
                    fontSize: hierarchyFontSize,
                    lineHeight: 1.2,
                    whiteSpace: "pre",
                    color: `rgba(237,246,255,${opacity})`,
                  }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: (i - 1) * hierarchyIndent + hierarchyStalkOffset,
                        // Leave clearance below the preceding text row.
                        top: hierarchyStalkGap - hierarchyGap,
                        width:
                          hierarchyIndent -
                          hierarchyStalkOffset -
                          hierarchyBranchGap,
                        height:
                          hierarchyGap +
                          hierarchyLineHeight / 2 -
                          hierarchyStalkGap,
                        borderLeft: `2px solid ${branchColor}`,
                        borderBottom: `2px solid ${branchColor}`,
                      }}
                    />
                  )}
                  {text}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ paddingLeft: "4px", fontSize: 84, color: "#EDF6FF" }}>
            {page.data.title}
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height,
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
