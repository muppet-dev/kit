import { useConfig } from "@/client/providers";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Chat } from "./Chat";
import { ModelsProvider, useModels } from "./providers";

export default function PlaygroundPage() {
  const { isModelsEnabled } = useConfig();

  if (!isModelsEnabled) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 size-full select-none text-muted-foreground">
        <Sparkles className="size-14" />
        <p className="text-xl font-medium">Ai Models are not provided</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 p-4 w-full overflow-x-auto">
      <ModelsProvider>
        <ChatRenderer />
      </ModelsProvider>
    </div>
  );
}

function ChatRenderer() {
  const { models, addModel } = useModels();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Adding a model
  useEffect(() => {
    if (models.length === 0) {
      addModel();
    }
  }, []);

  return (
    <>
      {models.map(({ id }) => (
        <Chat key={id} chatId={id} />
      ))}
    </>
  );
}
