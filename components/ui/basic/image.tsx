"use client"

import Image from 'next/image';
import React from 'react';
import { ALL_IMAGES, LAUNCHPAD_LOGOS, PARTNER_LOGOS, COMBINED_LOGOS } from '@/lib/images';

type ImageIdentifier = keyof typeof ALL_IMAGES | keyof typeof LAUNCHPAD_LOGOS | keyof typeof PARTNER_LOGOS | keyof typeof COMBINED_LOGOS;

interface LaunchpadImageProps {
  /** 
   * The identifier for the image to display. Can be:
   * - A key from ALL_IMAGES (e.g. "launchpad-main-color")
   * - A key from LAUNCHPAD_LOGOS (e.g. "mainColor")
   * - A key from PARTNER_LOGOS (e.g. "building21")
   * - A key from COMBINED_LOGOS (e.g. "launchpadBuilding21")
   */
  imageId: string;
  
  /** Width of the image in pixels or responsive unit */
  width?: number | string;
  
  /** Height of the image in pixels or responsive unit */
  height?: number | string;
  
  /** CSS class names to apply to the image */
  className?: string;
  
  /** Alt text for accessibility. Will use default alt text if not provided */
  alt?: string;
  
  /** Whether to optimize the image using Next.js Image component */
  unoptimized?: boolean;
  
  /** Whether to fill the parent container */
  fill?: boolean;
  
  /** Sizing behavior for responsive images */
  sizes?: string;
  
  /** Additional props to pass to the Next.js Image component */
  [key: string]: any;
}

/**
 * LaunchpadImage component for displaying images from uploadthing.com
 * 
 * Use this component to display any of the images defined in the lib/images.ts file.
 * It provides a consistent way to access images across the application.
 */
export function LaunchpadImage({
  imageId,
  width = 'auto',
  height = 'auto',
  className = '',
  alt,
  unoptimized = false,
  fill = false,
  sizes,
  ...props
}: LaunchpadImageProps) {
  // Try to find the image info in different collections
  let imageInfo;
  
  // Check in ALL_IMAGES
  if (ALL_IMAGES[imageId as keyof typeof ALL_IMAGES]) {
    imageInfo = ALL_IMAGES[imageId as keyof typeof ALL_IMAGES];
  } 
  // Check in LAUNCHPAD_LOGOS
  else if (LAUNCHPAD_LOGOS[imageId as keyof typeof LAUNCHPAD_LOGOS]) {
    imageInfo = LAUNCHPAD_LOGOS[imageId as keyof typeof LAUNCHPAD_LOGOS];
  }
  // Check in PARTNER_LOGOS
  else if (PARTNER_LOGOS[imageId as keyof typeof PARTNER_LOGOS]) {
    imageInfo = PARTNER_LOGOS[imageId as keyof typeof PARTNER_LOGOS];
  }
  // Check in COMBINED_LOGOS
  else if (COMBINED_LOGOS[imageId as keyof typeof COMBINED_LOGOS]) {
    imageInfo = COMBINED_LOGOS[imageId as keyof typeof COMBINED_LOGOS];
  }
  
  // If no image found, display a placeholder or error state
  if (!imageInfo) {
    console.error(`Image with ID "${imageId}" not found in any image collection`);
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-xs text-gray-500">Image not found</span>
      </div>
    );
  }
  
  // Use the provided alt text or fall back to the default alt text
  const finalAlt = alt || imageInfo.alt || 'Launchpad image';

  // Ensure we have proper width/height for the Next.js Image component
  const imageWidth = typeof width === 'number' ? width : 100;
  const imageHeight = typeof height === 'number' ? height : 100;
  
  // If using fill mode, return the appropriate component
  if (fill) {
    return (
      <div style={{ position: 'relative', width, height }} className={className}>
        <Image
          src={imageInfo.url}
          alt={finalAlt}
          fill={true}
          sizes={sizes || '100vw'}
          style={{ objectFit: 'contain' }}
          unoptimized={unoptimized}
          {...props}
        />
      </div>
    );
  }
  
  // For string width/height (like 'auto', '100%'), we need to use a fallback approach
  if (typeof width === 'string' || typeof height === 'string') {
    return (
      <img
        src={imageInfo.url}
        alt={finalAlt}
        className={className}
        style={{ 
          width: typeof width === 'string' ? width : undefined,
          height: typeof height === 'string' ? height : undefined
        }}
        {...props}
      />
    );
  }
  
  // Standard Next.js Image with numeric width/height
  return (
    <Image
      src={imageInfo.url}
      alt={finalAlt}
      width={imageWidth}
      height={imageHeight}
      className={className}
      unoptimized={unoptimized}
      {...props}
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