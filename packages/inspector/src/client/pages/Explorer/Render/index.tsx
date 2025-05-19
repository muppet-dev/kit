import { Tool, useTool } from "../providers";
import { GridComponent } from "./GridComponent";
import { RootsRender } from "./RootsRender";

export function ExplorerRender() {
  const { activeTool } = useTool();

  if (activeTool.name === Tool.ROOTS) return <RootsRender />;

  return <GridComponent />;
}
