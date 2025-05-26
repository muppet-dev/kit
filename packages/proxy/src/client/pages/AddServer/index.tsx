import { Plus } from "lucide-react";
import { AddServerForm } from "./Form";

export default function AddServerPage() {
  return (
    <div className="py-4 size-full flex flex-col gap-4 overflow-auto">
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <Plus className="size-7 stroke-[3]" />
        <h2 className="text-2xl font-bold">Add Server</h2>
      </div>
      <AddServerForm />
    </div>
  );
}
