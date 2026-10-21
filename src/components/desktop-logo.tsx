import type { SVGProps } from "react";

/** Theme-aware navigation mark; color attributes preserve the dark social-image palette. */
export function DesktopLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <rect
        width="64"
        height="64"
        rx="16"
        fill="#10254A"
        className="fill-[#E3EEFC] dark:fill-[#10254A]"
      />
      <rect
        x="10"
        y="13"
        width="42"
        height="29"
        rx="4"
        stroke="#EDF6FF"
        className="stroke-[#10254A] dark:stroke-[#EDF6FF]"
        strokeWidth="3.5"
      />
      <path
        d="M25 43v7m-7 0h19"
        stroke="#EDF6FF"
        className="stroke-[#10254A] dark:stroke-[#EDF6FF]"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect
        x="36"
        y="29"
        width="19"
        height="28"
        rx="4"
        fill="#10254A"
        stroke="#50D8F0"
        className="fill-[#E3EEFC] stroke-[#087F9B] dark:fill-[#10254A] dark:stroke-[#50D8F0]"
        strokeWidth="3.5"
      />
      <path
        d="M43 51h5"
        stroke="#50D8F0"
        className="stroke-[#087F9B] dark:stroke-[#50D8F0]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
