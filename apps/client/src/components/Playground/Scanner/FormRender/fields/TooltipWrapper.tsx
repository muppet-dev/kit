import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useField } from "duck-form";
import type { PropsWithChildren } from "react";

export type TooltipWrapperProps = {
  tooltip?: string;
};

export type TooltipWrapper = PropsWithChildren;

export function TooltipWrapper({ children }: TooltipWrapper) {
  const { tooltip } = useField<TooltipWrapperProps>();

  if (tooltip)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">{children}</div>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          className="rounded px-1.5 py-1 leading-none"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );

  return children;
}
