import { FieldErrorMessage } from "@/client/components/FieldErrorMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/client/components/ui/accordion";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { eventHandler } from "@/client/lib/eventHandler";
import type { configValidation } from "@/client/validations";
import { Plus, PlusSquare, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";

export function STDIOFields() {
  const { register } = useFormContext<z.infer<typeof configValidation>>();

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="command" required>
          Command
        </Label>
        <Input
          id="command"
          placeholder="Enter command"
          required
          {...register("command")}
        />
        <FieldErrorMessage name="command" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="args">Arguments</Label>
        <Input id="args" placeholder="Enter arguments" {...register("args")} />
        <FieldErrorMessage name="command" />
      </div>
      <Accordion type="single" collapsible className="flex flex-col">
        <AccordionItem
          value="1"
          className="border-b-0 h-full flex flex-col [&>div]:data-[state=open]:h-full [&>div]:data-[state=open]:flex"
        >
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2">
            Environmental Variables
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 w-full">
            <div className="w-full flex flex-col gap-2">
              <EnvField />
            </div>
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
    useFormContext<z.infer<typeof configValidation>>();

  const { fields, append, remove } = useFieldArray({
    name: "env",
    control,
  });

  const handleAddItem = eventHandler(() => append(ENV_FIELD_DEFAULT_VALUE));
  const handleDeleteItem = (index: number) => eventHandler(() => remove(index));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (ent) => {
        try {
          const raw = (ent.target?.result?.toString() || "").trim();

          if (raw.length === 0) return;

          const envs = parseKeyValueString(raw);

          if (envs.length === 0) return;

          append(envs);
        } catch (error: any) {
          toast.error(error.message || "Failed to parse the file");
        }
      };

      for (const file of event.target.files) {
        reader.readAsText(file);
      }
    }
  };

  return (
    <>
      {fields.length === 0 ? (
        <div className="h-[36px] w-full flex items-center justify-center border">
          <p className="text-sm select-none">No variables added</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[180px] overflow-y-auto">
          {fields.map((item, index) => (
            <div key={item.id} className="flex w-full items-center gap-2">
              <div className="w-full">
                <Input {...register(`env.${index}.key`)} placeholder="Key" />
                <FieldErrorMessage name={`env.${index}.key`} />
              </div>
              <div className="w-full">
                <Input
                  {...register(`env.${index}.value`)}
                  placeholder="Value"
                />
                <FieldErrorMessage name={`env.${index}.value`} />
              </div>
              <Button
                title="Delete Variable"
                type="button"
                className="h-max has-[>svg]:px-1.5 py-1.5 text-red-500 dark:text-red-300 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-300/20"
                variant="ghost"
                onClick={handleDeleteItem(index)}
                onKeyDown={handleDeleteItem(index)}
              >
                <Trash />
              </Button>
            </div>
          ))}
          <FieldErrorMessage name="env" />
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

const parseKeyValueString = (str: string) => {
  const result: { key: string; value: string }[] = [];
  const lines = str.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;

    const match = line.match(/^(\w+)=("(.*?)"|(.+))$/);

    if (match) {
      const key = match[1];
      const value = match[3] != null ? match[3] : match[4];
      result.push({ key, value });
    } else throw new Error(`Invalid line format: "${line}"`);
  }

  return result;
};
