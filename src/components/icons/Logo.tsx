import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 40"
      width="120"
      height="40"
      aria-label="Norruva Logo"
      {...props}
    >
      <text
        x="0"
        y="30"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="currentColor"
      >
        Norruva
      </text>
    </svg>
  );
}
