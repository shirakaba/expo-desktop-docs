# Expo Desktop docs

Documentation for [Expo Desktop](https://github.com/shirakaba/expo-desktop), built with Next.js and Fumadocs. The root URL opens the About page directly.

## Local development

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Next.js. To verify a production build locally:

```bash
pnpm build
pnpm start
```

These commands do not deploy the site.

## Content and navigation

- `content/docs/index.mdx`: About page at `/`.
- `content/docs/guides/`: creation, prebuild and desktop config, running, and distribution.
- `content/docs/cli/`: complete command and flag reference.
- `content/docs/{scope,how-it-works,ecosystem,licences}.mdx`: project context and resources.
- `content/docs/meta.json`: sidebar order; guides are expanded and CLI references are grouped.

The content describes the current Expo Desktop 1.x implementation and the SDK 55 / React Native 0.83 template line. When updating it, check `packages/expo-desktop/src/cli.ts`, the command implementations, the default prebuild plugins, and the templates in the source repository. Keep behavior caveats in sync with source fixes, especially the prebuild platform default and flag forwarding.

## Branding

`src/components/desktop-logo.tsx` contains the original monitor-and-phone mark used by navigation and social previews. `src/app/icon.svg` and `src/app/apple-icon.png` are the matching favicon and touch icon. The SVG and component should stay visually in sync. Theme tokens live in `src/app/global.css`.

## Links and hosting

The only retained link to the original personal documentation site is the requested talk link on `/ecosystem`. There are no inherited canonical or asset URLs pointing there. The GitHub navigation link points to the Expo Desktop project.

Metadata resolves its base URL from `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, with localhost as a local fallback. Configure these for the eventual hosting destination. No production hostname is hardcoded. This content update does not publish or deploy the website; the existing `vercel.json` hosting rules are unchanged.
