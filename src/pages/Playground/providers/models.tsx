import { nanoid } from "nanoid";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { ModelProps } from "../type";

type ModelsContextType = ReturnType<typeof useModelsManager>;

const ModelsContext = createContext<ModelsContextType | null>(null);

export const ModelsProvider = (props: PropsWithChildren) => {
  const values = useModelsManager();

  return (
    <ModelsContext.Provider value={values}>
      {props.children}
    </ModelsContext.Provider>
  );
};

function useModelsManager() {
  const [models, setModels] = useState<ModelProps[]>([]);
  const [syncText, setSyncText] = useState<string>("");

  function getModel(id: string) {
    const index = models.findIndex((model) => model.id === id);
    if (index !== -1) {
      return models[index];
    }

    return null;
  }

  function onConfigChange(id: string, values: Partial<ModelProps>) {
    setModels((prev) => {
      const index = prev.findIndex((model) => model.id === id);
      if (index !== -1) {
        prev[index] = { ...prev[index], ...values };

        if ("sync" in values) {
          prev[index].composer?.setText(values.sync ? syncText : "");
        }

        return [...prev];
      }
      return prev;
    });
  }

  function addModel() {
    setModels((prev) => [
      ...prev,
      { id: nanoid(), model: "openai:gpt-4.1", sync: true },
    ]);
  }

  function deleteModel(id: string) {
    setModels((prev) => {
      const index = prev.findIndex((model) => model.id === id);
      if (index !== -1) {
        prev.splice(index, 1);
        return [...prev];
      }
      return prev;
    });
  }

  function moveRight(id: string) {
    setModels((prev) => {
      const index = prev.findIndex((model) => model.id === id);
      if (index !== -1 && index < prev.length - 1) {
        const temp = prev[index + 1];
        prev[index + 1] = prev[index];
        prev[index] = temp;
        return [...prev];
      }
      return prev;
    });
  }

  function moveLeft(id: string) {
    setModels((prev) => {
      const index = prev.findIndex((model) => model.id === id);
      if (index !== -1 && index > 0) {
        const temp = prev[index - 1];
        prev[index - 1] = prev[index];
        prev[index] = temp;
        return [...prev];
      }
      return prev;
    });
  }

  function syncTextChange(chatId: string, text: string) {
    setSyncText(text);

    for (const model of models) {
      if (model.sync && model.composer && model.id !== chatId) {
        model.composer?.setText(text);
      }
    }
  }

  return {
    models,
    getModel,
    onConfigChange,
    addModel,
    deleteModel,
    moveRight,
    moveLeft,
    // Sync
    syncText,
    syncTextChange,
  };
}

export const useModels = () => {
  const context = useContext(ModelsContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};
