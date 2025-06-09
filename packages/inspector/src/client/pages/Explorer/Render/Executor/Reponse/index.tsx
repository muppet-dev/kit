import { CodeHighlighter } from "../../../../../components/Hightlighter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { numberFormatter } from "../../../../../lib/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormattedDataRender } from "./FormattedData";
import { useCustomForm } from "../provider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { eventHandler } from "../../../../../lib/eventHandler";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";

enum Format {
  TEXT = "text",
  JSON = "json",
  RAW = "raw",
  IMAGE = "image",
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

  let isMarkdown = false;
  let isImageType = false;

  let content: { text: string }[] = [];

  if (data?.content) {
    if ("contents" in data.content) content = data.content.contents;
    else if ("content" in data.content) content = data.content.content;

    for (const item of content) {
      if ("type" in item) {
        if (item.type === "image") isImageType = true;
      } else if ("mimeType" in item) isMarkdown = true;
    }
  }

  useEffect(() => {
    if (isMarkdown) setDataFormat(Format.TEXT);
    else if (isImageType) setDataFormat(Format.IMAGE);
    else setDataFormat(Format.JSON);
  }, [isMarkdown, isImageType]);

  if (isSubmitting || isSubmitSuccessful)
    return (
      <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
        <Header
          format={dataFormat}
          onFormatChange={setDataFormat}
          isPanelExpend={isExpend}
          onPanelExpandChange={onExpandChange}
          isMarkdown={isMarkdown}
          isImageType={isImageType}
        />
        {isSubmitting ? (
          <Skeleton className="size-full rounded-md" />
        ) : (
          <div className="overflow-y-auto flex-1 space-y-2">
            {dataFormat === Format.RAW ? (
              <CodeHighlighter
                content={JSON.stringify(data?.content, null, 2)}
              />
            ) : (
              <FormattedDataRender content={data?.content} />
            )}
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
        isMarkdown={props.isMarkdown}
        isImageType={props.isImageType}
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

  if (isSubmitting) return <Skeleton className="w-14 h-5 rounded-sm" />;

  return (
    <span className="text-xs text-success">
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
  isMarkdown: boolean;
  isImageType: boolean;
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
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value={Format.IMAGE} disabled={!props.isImageType}>
          Image
        </SelectItem>
        <SelectItem value={Format.TEXT} disabled={!props.isMarkdown}>
          Text
        </SelectItem>
        <SelectItem
          value={Format.JSON}
          disabled={props.isMarkdown || props.isImageType}
        >
          JSON
        </SelectItem>
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
