import { Tool, useTool } from "../providers";
import { GridComponent } from "./GridComponent";
import { RootsRender } from "./RootsRender";
import { SamplingRender } from "./SamplingRender";

export function ExplorerRender() {
  const { activeTool } = useTool();

  if (activeTool.name === Tool.ROOTS) return <RootsRender />;
  if (activeTool.name === Tool.SAMPLING) return <SamplingRender />;

  return <GridComponent />;
}
