import { defaultMakdownComponents } from "@/client/components/MakdownComponents";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import "@assistant-ui/react-markdown/styles/dot.css";
import { memo } from "react";
import remarkGfm from "remark-gfm";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultMakdownComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);
