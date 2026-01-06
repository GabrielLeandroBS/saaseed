import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    leading: "normal",
    tracking: "normal",
  },
});

type TextElement =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

function Text({
  className,
  as = "p",
  asChild = false,
  size,
  weight,
  align,
  leading,
  tracking,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: TextElement;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : as;

  return (
    <Comp
      data-slot="text"
      data-size={size}
      data-weight={weight}
      data-align={align}
      data-tracking={tracking}
      className={cn(
        textVariants({
          size,
          weight,
          align,
          leading,
          tracking,
          className,
        })
      )}
      {...props}
    />
  );
}

export { Text, textVariants };
