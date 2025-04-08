"use client";

import React from "react";
import NextImage from "next/image";
import { ALL_IMAGES } from "@/lib/images";

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
 * Renders an image using Next.js's NextImage component.
 *
 * If the image source is missing, logs a warning and returns null.
 *
 * @param src - The URL of the image to display. A valid string is required to render an image.
 * @param alt - Alternative text for the image.
 * @param className - Additional CSS class names for styling the image.
 * @param width - The width at which to display the image.
 * @param height - The height at which to display the image.
 *
 * @returns A NextImage component configured with the provided properties, or null if the image source is missing.
 */
export function Image({ src, alt, className, width, height }: ImageProps) {
  // Use a fallback image if the source is invalid
  if (!src) {
    console.warn("Image source is missing");
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
 * Renders an image based on the provided image ID with built-in error handling.
 *
 * The component retrieves an image from an internal store using the given identifier. If no image is found or if the
 * image's source is invalid, it logs a warning and displays a fallback UI with an appropriate message.
 * For valid images, it renders the image using NextImage. External image URLs are detected and rendered with optimization
 * disabled to avoid domain issues.
 *
 * @param imageId - The identifier used to fetch the image from the internal image store.
 * @param alt - Optional alternative text; if not provided, the image's own alt text is used.
 * @param className - Optional CSS classes for styling the image container.
 * @param width - The width of the image element; defaults to 100 if not specified.
 * @param height - The height of the image element; defaults to 100 if not specified.
 *
 * @returns A JSX element displaying the image or a fallback UI when the image is missing or invalid.
 *
 * @remark External image URLs are rendered with unoptimized mode to mitigate domain-related issues.
 */
export function LaunchpadImage({
  imageId,
  alt,
  className,
  width,
  height,
}: LaunchpadImageProps) {
  const image = ALL_IMAGES[imageId];

  if (!image) {
    console.warn(`Image not found: ${imageId}`);
    // Fallback to a default image that's stored locally
    return (
      <div
        className={`${className || ""} bg-gray-200 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-xs text-gray-500">Image not found</span>
      </div>
    );
  }

  if (typeof image.src !== "string") {
    console.warn(`Invalid image source for: ${imageId}`);
    return (
      <div
        className={`${className || ""} bg-gray-200 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-xs text-gray-500">Invalid image</span>
      </div>
    );
  }

  // If using an external URL, use a regular img tag instead of NextImage to avoid domain issues
  const isExternalUrl =
    image.src.startsWith("http") &&
    !image.src.includes("localhost") &&
    !image.src.includes(".ufs.sh") && // Only allow .ufs.sh URLs to go through NextImage
    !image.src.includes("vercel.app");

  if (isExternalUrl) {
    return (
      <NextImage
        src={image.src}
        alt={alt || image.alt}
        className={className}
        width={width || 100}
        height={height || 100}
        unoptimized={true} // Skip optimization for external URLs
        style={{ objectFit: "contain" }}
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
