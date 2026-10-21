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
type SelectorKey = "os" | "platform" | "distribution" | "interaction";
type Selection = Partial<Record<SelectorKey, string>>;
type Selector = {
  key: SelectorKey;
  label: string;
  options: Record<string, string>;
};
const defaultSelectors: Selector[] = [
  { key: "os", label: "Development OS", options: developmentOS },
  { key: "platform", label: "Target OS", options: targetOS },
];
const EnvironmentContext = createContext<Selection | null>(null);

function defaultSelection(selectors: Selector[]): Selection {
  return Object.fromEntries(
    selectors.map(({ key, options }) => [key, Object.keys(options)[0]]),
  );
}

function readSelection(selectors: Selector[], storageKey: string): Selection {
  let saved: Selection = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}") ?? {};
  } catch {
    // Storage may be unavailable or contain an outdated preference.
  }
  const query = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    selectors.map(({ key, options }) => {
      const value = query.get(key) ?? saved[key];
      return [
        key,
        value && Object.hasOwn(options, value)
          ? value
          : Object.keys(options)[0],
      ];
    }),
  );
}

/** Selectors filter MDX sections and can be nested for more specific choices. */
export function Environment({
  children,
  selectors = defaultSelectors,
  storageKey = "docs-environment",
}: {
  children: ReactNode;
  selectors?: Selector[];
  storageKey?: string;
}) {
  const parentSelection = useContext(EnvironmentContext);
  const [selection, setSelection] = useState(() => defaultSelection(selectors));
  useEffect(() => {
    const restore = () => setSelection(readSelection(selectors, storageKey));
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [selectors, storageKey]);

  function change(next: Selection) {
    setSelection(next);
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(next)) {
      url.searchParams.set(key, value);
    }
    window.history.pushState(null, "", url);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // The selectors still work when browser storage is disabled.
    }
  }

  return (
    <EnvironmentContext.Provider value={{ ...parentSelection, ...selection }}>
      <div className="not-prose my-6 space-y-3">
        {selectors.map(({ key, label, options }) => (
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

/** Omit a dimension to show content shared by several combinations. */
export function EnvironmentContent({
  os,
  platform,
  distribution,
  interaction,
  children,
}: {
  os?: DevelopmentOS | DevelopmentOS[];
  platform?: TargetOS | TargetOS[];
  distribution?: string | string[];
  interaction?: "interactive" | "non-interactive";
  children: ReactNode;
}) {
  const selection = useContext(EnvironmentContext);
  if (!selection)
    throw new Error("EnvironmentContent must be inside Environment");
  const matches = (
    filter: string | string[] | undefined,
    value: string | undefined,
  ) =>
    filter === undefined ||
    (value !== undefined &&
      (Array.isArray(filter) ? filter.includes(value) : filter === value));
  if (
    !matches(os, selection.os) ||
    !matches(platform, selection.platform) ||
    !matches(distribution, selection.distribution) ||
    !matches(interaction, selection.interaction)
  )
    return null;
  return <>{children}</>;
}
