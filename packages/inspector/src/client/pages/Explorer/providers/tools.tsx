import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConnection } from "../../../providers";

export enum Tool {
  TOOLS = "tools",
  PROMPTS = "prompts",
  STATIC_RESOURCES = "static-resources",
  DYNAMIC_RESOURCES = "dynamic-resources",
  ROOTS = "roots",
  SAMPLING = "sampling",
}

type ToolType = {
  name: Tool;
  label: string;
  enabled: boolean;
};

type ToolContextType = ReturnType<typeof useToolManager>;

const ToolContext = createContext<ToolContextType | null>(null);

export const ToolProvider = (props: PropsWithChildren) => {
  const values = useToolManager();

  return (
    <ToolContext.Provider value={values}>{props.children}</ToolContext.Provider>
  );
};

export const DEFAULT_TOOLS: ToolType[] = [
  {
    name: Tool.TOOLS,
    label: "Tools",
    enabled: false,
  },
  {
    name: Tool.PROMPTS,
    label: "Prompts",
    enabled: false,
  },
  {
    name: Tool.STATIC_RESOURCES,
    label: "Static Resources",
    enabled: false,
  },
  {
    name: Tool.DYNAMIC_RESOURCES,
    label: "Dynamic Resources",
    enabled: false,
  },
  {
    name: Tool.SAMPLING,
    label: "Sampling",
    enabled: true,
  },
  {
    name: Tool.ROOTS,
    label: "Roots",
    enabled: true,
  },
];

function useToolManager() {
  const [tools, setTools] = useState<ToolType[]>(DEFAULT_TOOLS);
  const [activeTool, setActiveTool] = useState<ToolType>(DEFAULT_TOOLS[0]);

  const { serverCapabilities } = useConnection();

  useEffect(() => {
    if (serverCapabilities) {
      const enableTools: Tool[] = [];

      if (serverCapabilities.tools) {
        enableTools.push(Tool.TOOLS);
      }
      if (serverCapabilities.prompts) {
        enableTools.push(Tool.PROMPTS);
      }

      if (serverCapabilities.resources) {
        enableTools.push(Tool.STATIC_RESOURCES, Tool.DYNAMIC_RESOURCES);
      }

      toggleToolState(enableTools, true);
    }
  }, [serverCapabilities]);

  function changeTool(toolName: string) {
    const newTool = tools.find((t) => t.name === toolName);
    if (newTool) {
      setActiveTool(newTool);
    }
  }

  function toggleToolState(tool: Tool | Tool[], enabled?: boolean) {
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
