import { useEffect } from "react";
import { Chat } from "./Chat";
import { ModelsProvider, useModels } from "./providers";

export default function PlaygroundPage() {
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
