import { highlightMatches } from "@/client/components/highlightMatches";
import { CardDescription } from "@/client/components/ui/card";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { useState } from "react";

export type CardDescriptionRender = {
  descriptionMatches: any;
  description: string;
};

export function CardDescriptionRender({
  description,
  descriptionMatches,
}: CardDescriptionRender) {
  const [isViewMore, setIsViewMore] = useState(false);

  const handleViewMoreOrLess = eventHandler(() =>
    setIsViewMore((prev) => !prev),
  );

  return (
    <CardDescription
      className={cn(
        "leading-tight tracking-tight inline-flex",
        isViewMore && "flex-col",
      )}
    >
      <span
        title={description}
        className={cn("w-full", !isViewMore && "line-clamp-2")}
      >
        {descriptionMatches
          ? highlightMatches(description, descriptionMatches)
          : description}
      </span>
      {description.length > 200 && (
        <span
          className={cn(
            "whitespace-nowrap text-foreground cursor-pointer",
            !isViewMore && "self-end",
          )}
          onClick={handleViewMoreOrLess}
          onKeyDown={handleViewMoreOrLess}
        >
          Read {isViewMore ? "less" : "more"}
        </span>
      )}
    </CardDescription>
  );
}
