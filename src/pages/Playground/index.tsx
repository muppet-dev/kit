import { ModelsProvider, useModels } from "./providers";
import { Chat } from "./Chat";

export default function PlaygroundPage({
  maxModels = 5,
}: {
  maxModels?: number;
}) {
  return (
    <div className="flex gap-2 p-4 size-full">
      <ModelsProvider>
        <ChatRenderer />
      </ModelsProvider>
    </div>
  );
}

function ChatRenderer() {
  const { models } = useModels();

  return models.map(({ id }) => <Chat key={id} chatId={id} />);
}
