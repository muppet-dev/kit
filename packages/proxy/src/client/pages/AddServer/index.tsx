import { Plus } from "lucide-react";
import { AddServerForm } from "./Form";

export default function AddServerPage() {
  return (
    <div className="p-4 size-full flex flex-col gap-4 overflow-auto">
      <div className="flex items-center gap-2">
        <Plus className="size-5" />
        <h2 className="text-2xl font-bold">Add Server</h2>
      </div>
      <AddServerForm />
    </div>
  );
}
