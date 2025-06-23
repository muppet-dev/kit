import { cn } from "@/client/lib/utils";
import {
  type AudioContent,
  CallToolResultSchema,
  GetPromptResultSchema,
  type ImageContent,
  ReadResourceResultSchema,
  type ResourceContents,
  type TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import type z from "zod";
import { AudioRender } from "./Audio";
import { ImageRender } from "./Image";
import { JsonRender } from "./Json";

export type FormattedDataRender = {
  result?:
    | z.infer<typeof CallToolResultSchema>
    | z.infer<typeof GetPromptResultSchema>
    | z.infer<typeof ReadResourceResultSchema>;
};

export function FormattedDataRender(props: FormattedDataRender) {
  if (!props.result) return;

  const resourceResult = ReadResourceResultSchema.safeParse(props.result);

  if (resourceResult.success) {
    return resourceResult.data.contents.map((content) => {
      console.log(content);
      return <RenderResource key={content.uri} {...content} />;
    });
  }

  const promptResult = GetPromptResultSchema.safeParse(props.result);

  if (promptResult.success) {
    return promptResult.data.messages.map((message, index) => {
      const Component = () => {
        switch (message.content.type) {
          case "image":
          case "text":
          case "audio":
            return (
              <RenderContent
                key={`${message.content.type}-${index}`}
                {...message.content}
              />
            );
          case "resource":
            return (
              <RenderResource
                key={`${message.content.type}-${index}`}
                {...message.content.resource}
              />
            );
        }
      };

      return (
        <div
          key={`message-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          className="space-y-2 border rounded-md px-2 py-2.5"
        >
          <div
            className={cn(
              "px-1.5 text-sm font-medium rounded-md w-max border",
              message.role === "user"
                ? "text-info bg-info/20 border-info/20"
                : "text-warning bg-warnitext-warning/20 border-warnitext-warning/20",
            )}
          >
            {message.role}
          </div>
          <div>
            <Component />
          </div>
        </div>
      );
    });
  }

  const toolsResult = CallToolResultSchema.safeParse(props.result);

  if (toolsResult.success) {
    if (toolsResult.data.isError) {
      return <>Something went wrong!</>;
    }

    return toolsResult.data.content.map((item, index) => {
      switch (item.type) {
        case "image":
        case "text":
        case "audio":
          return <RenderContent key={`${item.type}-${index}`} {...item} />;
        case "resource":
          return (
            <RenderResource key={`${item.type}-${index}`} {...item.resource} />
          );
      }
    });
  }
}

function RenderContent(props: ImageContent | TextContent | AudioContent) {
  switch (props.type) {
    case "image":
      return <ImageRender {...props} />;
    case "text":
      return <JsonRender {...props} />;
    case "audio":
      return <AudioRender {...props} />;
  }
}

function RenderResource(props: ResourceContents) {
  if ("text" in props && typeof props.text === "string") {
    return <JsonRender type="text" text={props.text} />;
  }

  if ("blob" in props && typeof props.blob === "string") {
    return (
      <ImageRender type="image" mimeType={props.mimeType!} data={props.blob} />
    );
  }
}
