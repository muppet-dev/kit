import * as React from "react";
import { FieldWrapper } from "./FieldWrapper";
import { TooltipWrapper } from "./TooltipWrapper";

export function BlockWrapper(props: React.PropsWithChildren) {
  return (
    <TooltipWrapper>
      <FieldWrapper>{props.children}</FieldWrapper>
    </TooltipWrapper>
  );
}
