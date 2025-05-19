import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { BodyText } from "./typography/BodyText"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary-blue text-white hover:bg-primary-blue/80",
        outline:
          "border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
)

export interface GlobalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  loading?: boolean
  text?: string
}

const GlobalButton = React.forwardRef<HTMLButtonElement, GlobalButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      iconLeft,
      iconRight,
      loading,
      text,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children ? (
          children
        ) : (
          <BodyText variant="body3">{text}</BodyText>
        )}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </Comp>
    )
  }
)
GlobalButton.displayName = "GlobalButton"

export { GlobalButton, buttonVariants }
