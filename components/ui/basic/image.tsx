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
 * Renders an image using the NextImage component.
 *
 * If a valid image source is provided via the `src` property, the image is rendered with the specified
 * alternative text, styling classes, width, and height. If the `src` property is falsy, the function logs
 * a warning and returns null.
 *
 * @param src - The URL of the image to display.
 * @param alt - The alternate text for the image, used for accessibility.
 * @param className - Optional CSS class names for styling the image.
 * @param width - Optional width for the image.
 * @param height - Optional height for the image.
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
 * Renders an image from a global collection using an identifier, with fallbacks for missing or invalid images.
 *
 * The component retrieves an image object from a predefined collection using the provided identifier.
 * If the image is not found or its source is invalid, it logs a warning and renders a fallback UI.
 * For valid images, it determines whether the source is external—if so, it renders with optimization disabled
 * and a contained object fit; otherwise, it renders the internal image normally with default dimensions if not provided.
 *
 * @param imageId - Identifier used to locate the image in the global collection.
 * @param alt - Alternative text for the image; if not provided, the image's default alt text is used.
 * @param className - Optional CSS classes applied to the rendered image or fallback container.
 * @param width - The width of the image; defaults to 100 if unspecified.
 * @param height - The height of the image; defaults to 100 if unspecified.
 *
 * @returns A NextImage component for valid images or a fallback div for missing or invalid images.
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