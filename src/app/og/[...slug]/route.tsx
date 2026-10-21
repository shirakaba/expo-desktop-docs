import { ImageResponse } from "next/og";
import { type CSSProperties } from "react";

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

  const hierarchyFontSize = Math.min(
    lines.length === 1 ? 60 : lines.length === 2 ? 50 : 40,
    // Keep longer titles and their branch indentation in the left half.
    ...lines.map((text, i) => 520 / (text.length * 0.6 + i * 2)),
  );

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
          right: (height - logoSize) / 2,
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
              rowGap: "12px",
            }}
          >
            {lines.map((text, i, acc) => {
              const branchStyle: CSSProperties = {
                marginRight: "0.33em",
              };

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    whiteSpace: "pre",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: hierarchyFontSize,
                    // @vercel/og only bundles Noto Sans 400, so this has no effect
                    fontWeight: i === acc.length - 1 ? 500 : 300,

                    color: `rgba(237,246,255,${minTextOpacity + ((i + 1) / acc.length) * (1 - minTextOpacity)})`,
                  }}
                >
                  {/* These are purely spacers */}
                  {lines.slice(0, i).map((line, j) => {
                    return (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          opacity: 0,
                        }}
                      >
                        {j > 0 && (
                          <Branch
                            style={{
                              ...branchStyle,
                              color: `rgba(237,246,255,${minTextOpacity + ((j + 1) / acc.length) * (1 - minTextOpacity) - 0.2})`,
                            }}
                          />
                        )}
                        <div
                          style={{ fontSize: 16 }}
                        >{`${line.slice(0, 1)}`}</div>
                      </div>
                    );
                  })}

                  {i > 0 && (
                    <Branch
                      style={{
                        ...branchStyle,
                        color: `rgba(237,246,255,${minTextOpacity + ((i + 1) / acc.length) * (1 - minTextOpacity) - 0.2})`,
                      }}
                    />
                  )}
                  {text}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ paddingLeft: "4px", fontSize: 52, color: "#EDF6FF" }}>
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

function Branch({ style = {} }: { style?: CSSProperties }) {
  const { height = "2em", color = "#EDF6FF" } = style;

  return (
    <div
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottomColor: color,
        borderLeftColor: color,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        width: "1.5em",
        height,
        marginTop: `-${height}`,
        ...style,
      }}
    ></div>
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
