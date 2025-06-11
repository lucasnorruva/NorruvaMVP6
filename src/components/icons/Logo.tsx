
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// Define props for the Logo component, extending NextImageProps but omitting src, alt, width, height
interface LogoProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height'> {
  // className is already part of ComponentProps via Omit
}

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/norruva.firebasestorage.app/o/Norruva_logo_Name.png?alt=media&token=52aa5e2e-5313-4aff-a0dc-5a0b38f77564";
const LOGO_INTRINSIC_WIDTH = 1096; // Assuming intrinsic width is similar, can be adjusted if needed
const LOGO_INTRINSIC_HEIGHT = 298; // Assuming intrinsic height is similar, can be adjusted if needed

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Image
      src={LOGO_URL}
      alt="Norruva Logo"
      width={LOGO_INTRINSIC_WIDTH}   // Provide intrinsic width for aspect ratio calculation
      height={LOGO_INTRINSIC_HEIGHT} // Provide intrinsic height for aspect ratio calculation
      className={cn(className)}      // Apply passed className for Tailwind sizing (e.g., h-8 w-auto)
      priority                       // Logos are often LCP elements, consider priority loading
      {...props}                     // Pass through any other valid Image props
    />
  );
}

