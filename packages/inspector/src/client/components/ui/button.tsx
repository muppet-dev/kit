import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        ghost: "",
        link: "text-primary underline-offset-4 hover:underline",
      },
      colorScheme: {
        default: "",
        destructive: "",
        secondary: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    compoundVariants: [
      {
        variant: ["default", "outline"],
        className: "shadow-xs",
      },
      {
        variant: "default",
        colorScheme: "default",
        className: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      {
        variant: "default",
        colorScheme: "destructive",
        className:
          "bg-destructive text-background hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      },
      {
        variant: "default",
        colorScheme: "secondary",
        className:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      {
        variant: "outline",
        colorScheme: "default",
        className:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      {
        variant: "outline",
        colorScheme: "destructive",
        className:
          "border-destructive bg-background text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:border-destructive dark:bg-input/30 dark:hover:bg-destructive/10",
      },
      {
        variant: "outline",
        colorScheme: "secondary",
        className:
          "border-secondary bg-background text-secondary hover:bg-secondary/10 focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 dark:border-secondary dark:bg-input/30 dark:hover:bg-secondary/10",
      },
      {
        variant: "ghost",
        colorScheme: "default",
        className:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      {
        variant: "ghost",
        colorScheme: "destructive",
        className: "hover:bg-destructive/10 text-destructive",
      },
      {
        variant: "ghost",
        colorScheme: "secondary",
        className:
          "hover:bg-secondary/10 text-secondary hover:text-secondary dark:hover:bg-secondary/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      colorScheme: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  colorScheme,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, colorScheme, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
