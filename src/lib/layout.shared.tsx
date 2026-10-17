import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { DesktopLogo } from "@/components/desktop-logo";

export const logo = <DesktopLogo width={30} height={30} className="shrink-0" />;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-semibold tracking-tight [header_&]:text-[15px]">
            Expo Desktop
          </span>
        </>
      ),
    },
  };
}
