import { FormattedDataRender } from "@/client/components/FormattedDataRender";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CodeHighlighter } from "../../../../components/Hightlighter";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { eventHandler } from "../../../../lib/eventHandler";
import { numberFormatter } from "../../../../lib/utils";
import { useCustomForm } from "./provider";

export type ReponsePanel = {
  isExpanded: boolean;
  onExpandChange: (expand: boolean) => void;
};

export function ReponsePanel({ isExpanded, onExpandChange }: ReponsePanel) {
  const [formatted, setFormatted] = useState(true);
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (!isSubmitting && !isSubmitSuccessful) return <></>;

  return (
    <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">Response</h2>
        <ResponseTime />
        <div className="flex-1" />
        <Select
          value={String(Number(formatted))}
          onValueChange={(value) => setFormatted(Boolean(Number(value)))}
          disabled={isSubmitting}
        >
          <SelectTrigger size="sm" className="py-1 px-2 gap-1.5 border-0 h-max">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="1">Formatted</SelectItem>
            <SelectItem value="0">Raw</SelectItem>
          </SelectContent>
        </Select>
        <ExpandPanelButton
          isPanelExpand={isExpanded}
          onPanelExpandChange={onExpandChange}
        />
      </div>
      {isSubmitting ? (
        <Skeleton className="size-full rounded-md" />
      ) : (
        <div className="overflow-y-auto flex-1 space-y-2">
          {formatted ? (
            <FormattedDataRender result={data?.content} />
          ) : (
            <CodeHighlighter content={JSON.stringify(data?.content, null, 2)} />
          )}
        </div>
      )}
    </div>
  );
}

function ResponseTime() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting) return <Skeleton className="w-14 h-5 rounded-sm" />;

  return (
    <span className="text-xs text-success">
      {(data?.duration ?? 0) > 1000
        ? `${numberFormatter(
            Number(((data?.duration ?? 0) / 1000).toFixed(2)),
            "decimal",
          )} s`
        : `${numberFormatter(data?.duration ?? 0, "decimal")} ms`}
    </span>
  );
}

type ExpandPanelButton = {
  isPanelExpand: boolean;
  onPanelExpandChange: (value: boolean) => void;
};

function ExpandPanelButton(props: ExpandPanelButton) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const ExpandButtonIcon = props.isPanelExpand ? ChevronDown : ChevronUp;

  const handlePanelExpandCollapse = eventHandler(() =>
    props.onPanelExpandChange(!props.isPanelExpand),
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="has-[>svg]:px-1.5 py-1.5 size-8"
          onClick={handlePanelExpandCollapse}
          onKeyDown={handlePanelExpandCollapse}
          disabled={isSubmitting}
        >
          <ExpandButtonIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {`${props.isPanelExpand ? "Collapse" : "Expand"} response panel`}
      </TooltipContent>
    </Tooltip>
  );
}
