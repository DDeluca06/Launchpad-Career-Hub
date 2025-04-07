"use client"

import React from 'react';
import { Image as NextImage } from 'next/image';
import { ALL_IMAGES } from '@/lib/images';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

interface LaunchpadImageProps {
  imageId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function Image({ src, alt, className, width, height }: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
}

export function LaunchpadImage({ imageId, alt, className, width, height }: LaunchpadImageProps) {
  const image = ALL_IMAGES[imageId];
  if (!image) {
    console.warn(`Image not found: ${imageId}`);
    return null;
  }

  return (
    <NextImage
      src={image.src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
}

/**
 * Usage Examples:
 * 
 * <LaunchpadImage imageId="launchpad-main-color" width={200} height={80} />
 * <LaunchpadImage imageId="mainColor" width="100%" height="auto" className="my-4" />
 * <LaunchpadImage imageId="building21" width={150} height={75} alt="Building 21 Organization" />
 * <LaunchpadImage imageId="launchpadBuilding21" width={300} />
 */