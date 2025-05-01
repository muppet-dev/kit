import { useState } from "react";
import { Model } from "./Model";
import type { ModelProps } from "./type";

export default function PlaygroundPage({
  maxModels = 5,
}: {
  maxModels?: number;
}) {
  const [models, setModels] = useState<ModelProps[]>([
    { model: undefined, maxTokens: 11977, temperature: 0.7, topP: 1 },
  ]);

  console.log(models);

  return (
    <div className="flex gap-2 p-4 size-full">
      {models.map((model, index, arr) => (
        <Model
          key={`model-${index + 1}`}
          config={model}
          onConfigChange={(config) =>
            setModels((prev) => {
              prev[index] = config;
              return [...prev];
            })
          }
          addModel={() => {
            if (arr.length < maxModels)
              setModels((prev) => {
                prev.splice(index + 1, 0, {
                  model: undefined,
                  maxTokens: 11977,
                  temperature: 0.7,
                  topP: 1,
                });
                return [...prev];
              });
          }}
          deleteModel={() => {
            if (index > 0)
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
