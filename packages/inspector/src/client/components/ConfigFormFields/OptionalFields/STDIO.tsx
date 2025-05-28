import { Plus, PlusSquare, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { eventHandler } from "../../../lib/eventHandler";
import type { configTransportSchema } from "../../../validations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export function STDIOFields() {
  const { register } = useFormContext<z.infer<typeof configTransportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 w-full items-center gap-2">
        <Label htmlFor="command" required>
          Command
        </Label>
        <Input
          id="command"
          className="col-span-3"
          placeholder="Enter command"
          required
          {...register("command")}
        />
      </div>
      <div className="grid grid-cols-4 w-full items-center gap-2">
        <Label htmlFor="arguments">Arguments</Label>
        <Input
          className="col-span-3 text-md"
          placeholder="Enter arguments"
          {...register("args")}
        />
      </div>
      <Accordion type="single" collapsible className="flex flex-col">
        <AccordionItem
          value="1"
          className="border-b-0 h-full flex flex-col [&>div]:data-[state=open]:h-full [&>div]:data-[state=open]:flex"
        >
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2 rounded-md">
            Environmental Variables
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 h-full w-full flex flex-col gap-2">
            <EnvField />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

const ENV_FIELD_DEFAULT_VALUE = {
  key: "",
  value: "",
};

function EnvField() {
  const { control, register } =
    useFormContext<z.infer<typeof configTransportSchema>>();

  const { fields, append, remove } = useFieldArray({
    name: "env",
    control,
  });

  const handleAddItem = eventHandler(() => append(ENV_FIELD_DEFAULT_VALUE));
  const handleDeleteItem = (index: number) => eventHandler(() => remove(index));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const raw = String(event.target?.result);
          const value = parseKeyValueString(raw);

          if (!value || Object.keys(value).length === 0)
            throw new Error("The file doesn't contain valid KEY=VALUE pairs.");

          const formattedValue = Object.entries(value).map(([key, value]) => ({
            key,
            value,
          }));

          append(formattedValue);
        } catch (error: any) {
          toast.error(error.message || "Failed to parse the file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {fields.length === 0 ? (
        <div className="h-[36px] rounded-md w-full flex items-center justify-center border">
          <p className="text-sm select-none">No variables added</p>
        </div>
      ) : (
        <div className="space-y-1">
          {fields.map((item, index) => (
            <div key={item.id} className="flex w-full items-center gap-2">
              <Input {...register(`env.${index}.key`)} placeholder="Key" />
              <Input {...register(`env.${index}.value`)} placeholder="Value" />
              <Button
                title="Delete Variable"
                variant="ghost"
                colorScheme="destructive"
                className="h-max has-[>svg]:px-1.5 py-1.5"
                onClick={handleDeleteItem(index)}
                onKeyDown={handleDeleteItem(index)}
              >
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          colorScheme="secondary"
          onClick={handleAddItem}
          onKeyDown={handleAddItem}
          className="w-max"
        >
          <Plus />
          Add variable
        </Button>
        <label
          htmlFor="env-file"
          className="h-9 px-4 py-2 shadow-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 w-max cursor-pointer flex items-center gap-2"
        >
          <PlusSquare className="size-4" />
          Add variable from file
          <Input
            id="env-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </>
  );
}

const parseKeyValueString = (str: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const lines = str.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;

    const match = line.match(/^(\w+)=("(.*?)"|(.+))$/);

    if (match) {
      const key = match[1];
      const value = match[3] != null ? match[3] : match[4];
      result[key] = value;
    } else throw new Error(`Invalid line format: "${line}"`);
  }

  return result;
};
