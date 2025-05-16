import { FolderTree } from "lucide-react";
import { RootsForm } from "./Form";

export function RootsRender() {
  return (
    <div className="px-4 size-full flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <FolderTree className="size-5" />
        <h2 className="text-2xl font-bold">Roots</h2>
      </div>
      <div className="border p-2 w-full">
        Configure the root directories that the server can access
      </div>
      <RootsForm />
    </div>
  );
}
