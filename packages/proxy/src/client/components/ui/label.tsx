import type * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/client/lib/utils";

function Label({
  className,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-0.5 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        required &&
          "after:text-red-500 after:content-['*'] dark:after:text-red-300",
        className
      )}
      {...props}
    />
  );
}

export { Label };
