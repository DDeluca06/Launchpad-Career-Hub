"use client"

import React from 'react';
import NextImage from 'next/image';
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

/**
 * Renders an image using the NextImage component if a valid source is provided.
 *
 * If the image source is missing, a warning is logged and null is returned to prevent rendering an incomplete image.
 *
 * @param src - The URL or path of the image to display.
 * @param alt - The alternative text description for the image.
 * @param className - The CSS class applied to the image element.
 * @param width - The width of the image.
 * @param height - The height of the image.
 *
 * @returns A NextImage component configured with the provided properties, or null if the source is missing.
 */
export function Image({ src, alt, className, width, height }: ImageProps) {
  // Use a fallback image if the source is invalid
  if (!src) {
    console.warn('Image source is missing');
    return null;
  }
  
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

/**
 * Renders an image based on a preset identifier with fallback handling.
 *
 * This function retrieves an image object from a predefined collection using the provided imageId.
 * If the image is not found or its source is invalid (i.e., not a string), a warning is logged and a
 * fallback UI is displayed. For external image URLs (determined by specific domain checks), the image
 * is rendered with optimization disabled using NextImage; otherwise, it is rendered normally.
 *
 * @example
 * <LaunchpadImage imageId="logo" alt="Company Logo" width={150} height={150} />
 */
export function LaunchpadImage({ imageId, alt, className, width, height }: LaunchpadImageProps) {
  const image = ALL_IMAGES[imageId];
  
  if (!image) {
    console.warn(`Image not found: ${imageId}`);
    // Fallback to a default image that's stored locally
    return (
      <div className={`${className || ''} bg-gray-200 flex items-center justify-center`} style={{ width, height }}>
        <span className="text-xs text-gray-500">Image not found</span>
      </div>
    );
  }
  
  if (typeof image.src !== 'string') {
    console.warn(`Invalid image source for: ${imageId}`);
    return (
      <div className={`${className || ''} bg-gray-200 flex items-center justify-center`} style={{ width, height }}>
        <span className="text-xs text-gray-500">Invalid image</span>
      </div>
    );
  }

  // If using an external URL, use a regular img tag instead of NextImage to avoid domain issues
  const isExternalUrl = 
    image.src.startsWith('http') && 
    !image.src.includes('localhost') && 
    !image.src.includes('.ufs.sh') && // Only allow .ufs.sh URLs to go through NextImage
    !image.src.includes('vercel.app');
    
  if (isExternalUrl) {
    return (
      <NextImage
        src={image.src}
        alt={alt || image.alt}
        className={className}
        width={width || 100}
        height={height || 100}
        unoptimized={true}  // Skip optimization for external URLs
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // For internal URLs that we've configured in next.config.js, use NextImage
  return (
    <NextImage
      src={image.src}
      alt={alt || image.alt}
      className={className}
      width={width || 100}
      height={height || 100}
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