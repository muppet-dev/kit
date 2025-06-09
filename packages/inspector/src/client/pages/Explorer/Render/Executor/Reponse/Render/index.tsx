import {
  CallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import z from "zod";
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

  const toolsResult = CallToolResultSchema.safeParse(props.result);

  if (toolsResult.success) {
    if (toolsResult.data.isError) {
      return <>Something went wrong!</>;
    }

    return toolsResult.data.content.map((item) => {
      switch (item.type) {
        case "image":
          return <ImageRender {...item} />;
        case "text":
          return <JsonRender {...item} />;
        case "audio":
          return <>Audio</>;
        case "resource":
          return <>Resource</>;
      }
    });
  }

  const promptResult = GetPromptResultSchema.safeParse(props.result);

  if (promptResult.success) {
    promptResult.data.messages[0].content.type;
  }
}
