"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const developmentOS = { macos: "macOS", windows: "Windows", linux: "Linux" };
const targetOS = {
  macos: "macOS",
  windows: "Windows",
  ios: "iOS",
  android: "Android",
};
type DevelopmentOS = keyof typeof developmentOS;
type TargetOS = keyof typeof targetOS;
type Selection = { os: DevelopmentOS; platform: TargetOS };
const defaults: Selection = { os: "macos", platform: "macos" };
const storageKey = "docs-environment";
const EnvironmentContext = createContext<Selection | null>(null);

function readSelection(): Selection {
  let saved: Partial<Selection> = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}") ?? {};
  } catch {
    // Storage may be unavailable or contain an outdated preference.
  }
  const query = new URLSearchParams(window.location.search);
  const os = query.get("os") ?? saved.os;
  const platform = query.get("platform") ?? saved.platform;
  return {
    os:
      os && Object.hasOwn(developmentOS, os)
        ? (os as DevelopmentOS)
        : defaults.os,
    platform:
      platform && Object.hasOwn(targetOS, platform)
        ? (platform as TargetOS)
        : defaults.platform,
  };
}

/** Two independent selectors can filter any number of MDX sections below them. */
export function Environment({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState(defaults);
  useEffect(() => {
    const restore = () => setSelection(readSelection());
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function change(next: Selection) {
    setSelection(next);
    const url = new URL(window.location.href);
    url.searchParams.set("os", next.os);
    url.searchParams.set("platform", next.platform);
    window.history.pushState(null, "", url);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // The selectors still work when browser storage is disabled.
    }
  }

  return (
    <EnvironmentContext.Provider value={selection}>
      <div className="not-prose my-6 space-y-3">
        {(
          [
            { key: "os", label: "Development OS", options: developmentOS },
            { key: "platform", label: "Target OS", options: targetOS },
          ] as const
        ).map(({ key, label, options }) => (
          <div
            key={key}
            role="group"
            aria-label={label}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b px-1"
          >
            <span className="me-auto text-sm font-medium">{label}</span>
            {Object.entries(options).map(([value, name]) => (
              <button
                key={value}
                type="button"
                aria-pressed={selection[key] === value}
                onClick={() => change({ ...selection, [key]: value })}
                className="text-fd-muted-foreground hover:text-fd-accent-foreground focus-visible:outline-fd-ring aria-pressed:border-fd-primary aria-pressed:text-fd-primary border-b border-transparent py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {name}
              </button>
            ))}
          </div>
        ))}
      </div>
      {children}
    </EnvironmentContext.Provider>
  );
}

/** Omit either dimension to show content shared by several combinations. */
export function EnvironmentContent({
  os,
  platform,
  children,
}: {
  os?: DevelopmentOS | DevelopmentOS[];
  platform?: TargetOS | TargetOS[];
  children: ReactNode;
}) {
  const selection = useContext(EnvironmentContext);
  if (!selection)
    throw new Error("EnvironmentContent must be inside Environment");
  const matches = <T extends string>(filter: T | T[] | undefined, value: T) =>
    filter === undefined ||
    (Array.isArray(filter) ? filter.includes(value) : filter === value);
  if (!matches(os, selection.os) || !matches(platform, selection.platform))
    return null;
  return <>{children}</>;
}
