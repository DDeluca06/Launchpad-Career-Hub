"use client";

import Image from "next/image";
import { ALL_IMAGES } from "@/lib/images";

interface LaunchpadImageProps {
  imageId?: string;
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export function LaunchpadImage({
  imageId,
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder-logo.png",
}: LaunchpadImageProps) {
  // Case 1: Using imageId to reference a predefined image
  if (imageId && ALL_IMAGES[imageId]) {
    const image = ALL_IMAGES[imageId];
    return (
      <Image
        src={image.url}
        alt={alt || image.alt || "Image"}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          if (fallbackSrc) {
            // Cast to HTMLImageElement to access src property
            const target = e.target as HTMLImageElement;
            target.src = fallbackSrc;
          }
        }}
      />
    );
  }
  
  // Case 2: Using direct src
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          if (fallbackSrc) {
            // Cast to HTMLImageElement to access src property
            const target = e.target as HTMLImageElement;
            target.src = fallbackSrc;
          }
        }}
      />
    );
  }
  
  // Fallback case: No valid source, show fallback
  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}