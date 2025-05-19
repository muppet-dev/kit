import { CodeHighlighter } from "../../../../components/Hightlighter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../../components/ui/select";
import { Skeleton } from "../../../../components/ui/skeleton";
import { numberFormatter } from "../../../../lib/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { JSONRender } from "./JSONRender";
import { useCustomForm } from "./provider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { eventHandler } from "../../../../lib/eventHandler";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";

enum Format {
  JSON = "json",
  RAW = "raw",
}

export type ReponsePanel = {
  isExpend: boolean;
  onExpandChange: (expand: boolean) => void;
};

export function ReponsePanel({ isExpend, onExpandChange }: ReponsePanel) {
  const [dataFormat, setDataFormat] = useState<Format>(Format.JSON);
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting || isSubmitSuccessful)
    return (
      <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
        <Header
          format={dataFormat}
          onFormatChange={setDataFormat}
          isPanelExpend={isExpend}
          onPanelExpandChange={onExpandChange}
        />
        {isSubmitting ? (
          <Skeleton className="size-full" />
        ) : (
          <div className="overflow-y-auto flex-1 space-y-2">
            {dataFormat === "raw" && (
              <CodeHighlighter
                content={JSON.stringify(data?.content, null, 2)}
              />
            )}
            {dataFormat === "json" && <JSONRender content={data?.content} />}
          </div>
        )}
      </div>
    );
}

function Header(props: FormatSelect & ExpandPanelButton) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-semibold">Response</h2>
      <ResponseTime />
      <div className="flex-1" />
      <FormatSelect
        format={props.format}
        onFormatChange={props.onFormatChange}
      />
      <ExpandPanelButton
        isPanelExpend={props.isPanelExpend}
        onPanelExpandChange={props.onPanelExpandChange}
      />
    </div>
  );
}

function ResponseTime() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting) return <Skeleton className="w-14 h-5" />;

  return (
    <span className="text-xs text-green-600 font-medium dark:text-green-400">
      {(data?.duration ?? 0) > 1000
        ? `${numberFormatter(
            Number(((data?.duration ?? 0) / 1000).toFixed(2)),
            "decimal"
          )} s`
        : `${numberFormatter(data?.duration ?? 0, "decimal")} ms`}
    </span>
  );
}

type FormatSelect = {
  format: Format;
  onFormatChange: (val: Format) => void;
};

function FormatSelect(props: FormatSelect) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Select
      value={props.format}
      onValueChange={(val) => props.onFormatChange(val as Format)}
      disabled={isSubmitting}
    >
      <SelectTrigger size="sm" className="py-1 px-2 gap-1.5 border-0 h-max">
        {props.format === Format.JSON ? "JSON" : "Raw"}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value={Format.JSON}>JSON</SelectItem>
        <SelectItem value={Format.RAW}>Raw</SelectItem>
      </SelectContent>
    </Select>
  );
}

type ExpandPanelButton = {
  isPanelExpend: boolean;
  onPanelExpandChange: (value: boolean) => void;
};

function ExpandPanelButton(props: ExpandPanelButton) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const ExpandButtonIcon = props.isPanelExpend ? ChevronDown : ChevronUp;

  const handlePanelExpandCollapse = eventHandler(() =>
    props.onPanelExpandChange(!props.isPanelExpend)
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
        {`${props.isPanelExpend ? "Collapse" : "Expand"} response panel`}
      </TooltipContent>
    </Tooltip>
  );
}
