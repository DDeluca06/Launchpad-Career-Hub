"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LaunchpadImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  fallbackSrc?: string
}

/**
 * LaunchpadImage - A wrapper around Next.js Image component that handles:
 * - Fallback image display when images fail to load
 * - Consistent image sizing and styling
 * - Placeholder display during loading
 */
export function LaunchpadImage({
  src,
  alt,
  width = 64,
  height = 64,
  className,
  fallbackSrc = "/placeholder-logo.png",
  ...props
}: LaunchpadImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src as string)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center bg-gray-50",
        isLoading && "animate-pulse",
        className
      )}
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
    >
      {!hasError && (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setImgSrc(fallbackSrc)
            setIsLoading(false)
          }}
          {...props}
        />
      )}
      
      {hasError && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-lg font-medium">
          {alt?.charAt(0) || '?'}
        </div>
      )}
    </div>
  )
} 