import type { LLMModel } from "@/constants";
import { useState } from "react";
import { ModelRender } from "./Model";

export function LLMScoringPage() {
  const [models, setModels] = useState<{ model: LLMModel | undefined }[]>([
    { model: undefined },
  ]);

  return (
    <div className="flex gap-2 p-4 h-full">
      {models.map((model, index) => (
        <ModelRender
          key={`model-${index + 1}`}
          model={model.model}
          onModelChange={(value) => {
            setModels((prev) => {
              prev[index].model = value as LLMModel;
              return [...prev];
            });
          }}
          addModel={() => {
            setModels((prev) => {
              prev.splice(index + 1, 0, { model: undefined });
              return [...prev];
            });
          }}
          deleteChat={() => {
            setModels((prev) => {
              prev.splice(index, 1);
              return [...prev];
            });
          }}
          moveLeft={() => {
            if (index > 0) {
              setModels((prev) => {
                const temp = prev[index - 1];
                prev[index - 1] = prev[index];
                prev[index] = temp;
                return [...prev];
              });
            }
          }}
          moveRight={() => {
            if (index < models.length - 1) {
              setModels((prev) => {
                const temp = prev[index + 1];
                prev[index + 1] = prev[index];
                prev[index] = temp;
                return [...prev];
              });
            }
          }}
        />
      ))}
    </div>
  );
}
