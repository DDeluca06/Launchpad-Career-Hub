"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-launchpad-blue text-white hover:bg-launchpad-teal dark:bg-launchpad-blue dark:hover:bg-launchpad-teal",
        primary:
          "bg-launchpad-blue text-white hover:bg-launchpad-teal shadow-sm dark:bg-launchpad-blue dark:hover:bg-launchpad-teal",
        secondary:
          "bg-launchpad-lightBlue text-launchpad-blue hover:bg-launchpad-blue hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        success:
          "bg-launchpad-green text-white hover:bg-launchpad-darkGreen dark:bg-launchpad-green dark:hover:bg-launchpad-darkGreen",
        warning:
          "bg-launchpad-orange text-white hover:bg-launchpad-brown dark:bg-launchpad-orange dark:hover:bg-launchpad-brown",
        danger:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-50 hover:text-launchpad-blue dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
        ghost:
          "hover:bg-gray-100 hover:text-launchpad-blue dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white",
        link: "text-launchpad-blue underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-9 w-9",
        auto: "h-auto px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      icon,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {icon && !isLoading && <span className="mr-1">{icon}</span>}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
