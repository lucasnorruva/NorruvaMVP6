import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Define props for the Logo component, extending NextImageProps but omitting src, alt, width, height
interface LogoProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    "src" | "alt" | "width" | "height"
  > {
  // className is already part of ComponentProps via Omit
}

const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/norruva.firebasestorage.app/o/Norruva%20Logo.png?alt=media&token=08d8ede9-1121-433b-bfa5-7ccb4497a09f";
const LOGO_INTRINSIC_WIDTH = 1096;
const LOGO_INTRINSIC_HEIGHT = 298;

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Image
      src={LOGO_URL}
      alt="Norruva Logo"
      width={LOGO_INTRINSIC_WIDTH}
      height={LOGO_INTRINSIC_HEIGHT}
      className={cn(className)}
      priority
      {...props}
    />
  );
}
