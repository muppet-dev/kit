import { useConnection } from "./connection";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ToolContextType = ReturnType<typeof useToolManager>;

const ToolContext = createContext<ToolContextType | null>(null);

export const ToolProvider = (props: PropsWithChildren) => {
  const values = useToolManager();

  return (
    <ToolContext.Provider value={values}>{props.children}</ToolContext.Provider>
  );
};

const DEFAULT_TOOLS = [
  {
    name: "tools",
    label: "Tools",
    enabled: false,
  },
  {
    name: "prompts",
    label: "Prompts",
    enabled: false,
  },
  {
    name: "static-resources",
    label: "Static Resources",
    enabled: false,
  },
  {
    name: "dynamic-resources",
    label: "Dynamic Resources",
    enabled: false,
  },
];

function useToolManager() {
  const [tools, setTools] = useState(DEFAULT_TOOLS);
  const [activeTool, setActiveTool] = useState(DEFAULT_TOOLS[0]);

  const { serverCapabilities } = useConnection();

  useEffect(() => {
    if (serverCapabilities) {
      const enableTools: string[] = [];

      if (serverCapabilities.tools) {
        enableTools.push("tools");
      }
      if (serverCapabilities.prompts) {
        enableTools.push("prompts");
      }

      if (serverCapabilities.resources) {
        enableTools.push("static-resources", "dynamic-resources");
      }

      toggleToolState(enableTools, true);
    }
  }, [serverCapabilities]);

  function changeTool(tool: string) {
    const newTool = tools.find((t) => t.name === tool);
    if (newTool) {
      setActiveTool(newTool);
    }
  }

  function toggleToolState(tool: string | string[], enabled?: boolean) {
    const _tools = Array.isArray(tool) ? tool : [tool];
    const newTools = tools.map((t) => {
      if (_tools.includes(t.name)) {
        return { ...t, enabled: enabled ?? !t.enabled };
      }
      return t;
    });
    setTools(newTools);
  }

  return {
    tools,
    activeTool,
    changeTool,
    toggleToolState,
  };
}

export const useTool = () => {
  const context = useContext(ToolContext);

  if (!context) throw new Error("Missing ToolContext.Provider in the tree!");

  return context;
};
