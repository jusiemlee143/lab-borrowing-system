import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * ============================================================
 * BUTTON VARIANTS
 * ============================================================
 *
 * Design system:
 * - Primary: Maroon
 * - Accent: Gold
 * - Neutral: White / Gray
 * - Destructive: Red
 *
 * Designed to match the Lab Borrowing System dashboard.
 */

const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "whitespace-nowrap",
    "rounded-lg",
    "text-sm",
    "font-semibold",
    "transition-all",
    "duration-200",
    "ease-out",
    "select-none",

    // Focus
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#800000]/20",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-white",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",

    // SVG defaults
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",

    // Active state
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        /**
         * ======================================================
         * DEFAULT / PRIMARY
         * ======================================================
         *
         * Main action button.
         *
         * Example:
         * Add New Item
         * Save
         * Submit
         */
        default: [
          "bg-[#800000]",
          "text-[#FFD700]",
          "shadow-sm",
          "border",
          "border-[#800000]",

          "hover:bg-[#660000]",
          "hover:border-[#660000]",
          "hover:shadow-md",

          "focus-visible:ring-[#800000]/30",
        ].join(" "),

        /**
         * ======================================================
         * GOLD
         * ======================================================
         *
         * Accent action.
         *
         * Example:
         * Important confirmation
         * Highlighted CTA
         */
        gold: [
          "bg-[#FFD700]",
          "text-[#800000]",
          "border",
          "border-[#FFD700]",

          "shadow-sm",

          "hover:bg-[#e6c200]",
          "hover:border-[#e6c200]",
          "hover:shadow-md",

          "focus-visible:ring-[#FFD700]/40",
        ].join(" "),

        /**
         * ======================================================
         * DESTRUCTIVE
         * ======================================================
         */
        destructive: [
          "bg-red-600",
          "text-white",
          "border",
          "border-red-600",
          "shadow-sm",

          "hover:bg-red-700",
          "hover:border-red-700",
          "hover:shadow-md",

          "focus-visible:ring-red-500/30",
        ].join(" "),

        /**
         * ======================================================
         * OUTLINE
         * ======================================================
         *
         * Good for:
         * Logout
         * Cancel
         * Secondary actions
         */
        outline: [
          "bg-white",
          "text-[#800000]",
          "border",
          "border-[#800000]/20",
          "shadow-sm",

          "hover:bg-[#800000]",
          "hover:text-[#FFD700]",
          "hover:border-[#800000]",
          "hover:shadow-md",

          "focus-visible:ring-[#800000]/30",
        ].join(" "),

        /**
         * ======================================================
         * SECONDARY
         * ======================================================
         *
         * Neutral button for less important actions.
         */
        secondary: [
          "bg-gray-100",
          "text-gray-700",
          "border",
          "border-gray-200",
          "shadow-sm",

          "hover:bg-gray-200",
          "hover:text-gray-900",
          "hover:border-gray-300",
        ].join(" "),

        /**
         * ======================================================
         * GHOST
         * ======================================================
         *
         * Minimal button.
         *
         * Example:
         * Refresh
         * Toolbar actions
         */
        ghost: [
          "bg-transparent",
          "text-gray-600",
          "border",
          "border-transparent",

          "hover:bg-[#800000]/5",
          "hover:text-[#800000]",
          "hover:border-[#800000]/10",
        ].join(" "),

        /**
         * ======================================================
         * LINK
         * ======================================================
         */
        link: [
          "text-[#800000]",
          "bg-transparent",
          "border-transparent",
          "underline-offset-4",

          "hover:underline",
          "hover:text-[#660000]",

          "active:scale-100",
        ].join(" "),
      },

      size: {
        /**
         * Default
         */
        default: [
          "h-10",
          "px-4",
          "py-2",
        ].join(" "),

        /**
         * Small
         */
        sm: [
          "h-9",
          "rounded-lg",
          "px-3",
          "text-xs",
        ].join(" "),

        /**
         * Large
         */
        lg: [
          "h-11",
          "rounded-lg",
          "px-8",
          "text-sm",
        ].join(" "),

        /**
         * Icon-only
         */
        icon: [
          "h-9",
          "w-9",
          "p-0",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }