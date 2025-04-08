"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent as DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/overlay/dialog";
import { Button } from "@/components/ui/basic/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Custom DialogContent that doesn't include the default close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] gap-0 border border-gray-200 bg-white p-0 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      {/* Close button is deliberately omitted here */}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export interface MultiPurposeModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Function to call when the open state changes
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The title of the modal
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Size of the modal: 'sm', 'md', 'lg', 'xl', 'full'
   * @default 'md'
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";

  /**
   * Whether to show a footer with actions
   * @default false
   */
  showFooter?: boolean;

  /**
   * Primary action button text
   */
  primaryActionText?: string;

  /**
   * Function to call when the primary action button is clicked
   */
  onPrimaryAction?: () => void;

  /**
   * Secondary action button text
   */
  secondaryActionText?: string;

  /**
   * Function to call when the secondary action button is clicked
   */
  onSecondaryAction?: () => void;

  /**
   * Whether the primary action is loading
   * @default false
   */
  isPrimaryActionLoading?: boolean;

  /**
   * Children to render in the modal body
   */
  children: React.ReactNode;

  /**
   * Additional footer content
   */
  footerContent?: React.ReactNode;

  /**
   * Whether to allow scrolling in the modal body
   * @default true
   */
  scrollable?: boolean;
}

/**
 * MultiPurposeModal - A flexible modal component that can be used for various purposes.
 *
 * Use this for:
 * - Filtering options
 * - Viewing detailed information
 * - Displaying recommendations
 * - Showing all items in a collection
 * - Job application details
 */
export function MultiPurposeModal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  showFooter = false,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  isPrimaryActionLoading = false,
  children,
  footerContent,
  scrollable = true,
}: MultiPurposeModalProps) {
  const sizeClasses = {
    sm: "sm:max-w-[425px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[800px]",
    xl: "sm:max-w-[1000px]",
    full: "sm:max-w-[90vw] sm:h-[90vh]",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 overflow-hidden border border-gray-200 shadow-xl",
          sizeClasses[size],
          size === "full" && "sm:h-[90vh] flex flex-col",
          "data-[state=open]:duration-300 data-[state=open]:animation-in",
        )}
      >
        <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-gray-600">
                  {description}
                </DialogDescription>
              )}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div
          className={cn(
            "px-6 py-5 bg-gray-50",
            scrollable && "overflow-y-auto max-h-[70vh]",
            size === "full" && "flex-1",
          )}
        >
          {children}
        </div>

        {(showFooter || footerContent) && (
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3 flex-wrap justify-end">
            {footerContent}

            {secondaryActionText && onSecondaryAction && (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="px-5 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {secondaryActionText}
              </Button>
            )}

            {primaryActionText && onPrimaryAction && (
              <Button
                onClick={onPrimaryAction}
                disabled={isPrimaryActionLoading}
                className="px-5 bg-launchpad-blue hover:bg-launchpad-teal text-white"
              >
                {isPrimaryActionLoading ? "Loading..." : primaryActionText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
