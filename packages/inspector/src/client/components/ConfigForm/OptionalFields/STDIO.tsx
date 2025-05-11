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
import type { transportSchema } from "@/client/validations";
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";

export function STDIOFields() {
  const { register } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="command">Command</Label>
        <Input
          id="command"
          className="col-span-3"
          placeholder="Enter command"
          {...register("command")}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="arguments">Arguments</Label>
        <Input
          className="col-span-3 text-md"
          placeholder="Enter arguments"
          {...register("args")}
        />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2">
            Environmental Variables
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0">
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
    useFormContext<z.infer<typeof transportSchema>>();

  const { fields, append, insert, move, remove } = useFieldArray({
    name: "env",
    control,
  });

  const handleAddItem = eventHandler(() => append(ENV_FIELD_DEFAULT_VALUE));
  const handleMoveUp = (index: number) =>
    eventHandler(() => move(index, index - 1));
  const handleMoveDown = (index: number) =>
    eventHandler(() => move(index, index + 1));
  const handleInsertItem = (index: number) =>
    eventHandler(() => insert(index + 1, ENV_FIELD_DEFAULT_VALUE));
  const handleDeleteItem = (index: number) => eventHandler(() => remove(index));

  return (
    <div className="space-y-2">
      {fields.length === 0 ? (
        <div className="h-[78px] w-full flex items-center justify-center border">
          <p className="text-sm select-none">No variables added</p>
        </div>
      ) : (
        <div className="max-h-[370px] h-full overflow-y-auto space-y-2">
          {fields.map((item, index, arr) => (
            <div
              key={item.id}
              className="flex w-full items-center border p-2 gap-2"
            >
              <div className="flex flex-col gap-1">
                <Button
                  title="Move Up"
                  type="button"
                  className="h-max has-[>svg]:px-1.5 py-1.5"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={handleMoveUp(index)}
                  onKeyDown={handleMoveUp(index)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  title="Move Down"
                  type="button"
                  className="h-max has-[>svg]:px-1.5 py-1.5"
                  variant="ghost"
                  disabled={index === arr.length - 1}
                  onClick={handleMoveDown(index)}
                  onKeyDown={handleMoveDown(index)}
                >
                  <ArrowDown />
                </Button>
              </div>
              <div className="flex gap-2 w-full">
                <div className="space-y-1 w-full">
                  <Label htmlFor={`env.${index}.key`}>Key</Label>
                  <Input
                    {...register(`env.${index}.key`)}
                    placeholder="Enter Key"
                  />
                </div>
                <div className="space-y-1 w-full">
                  <Label htmlFor={`env.${index}.value`}>Value</Label>
                  <Input
                    {...register(`env.${index}.value`)}
                    placeholder="Enter Value"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  title="Add"
                  type="button"
                  className="h-max has-[>svg]:px-1.5 py-1.5"
                  variant="ghost"
                  onClick={handleInsertItem(index)}
                  onKeyDown={handleInsertItem(index)}
                >
                  <Plus />
                </Button>
                <Button
                  title="Delete"
                  type="button"
                  className="h-max has-[>svg]:px-1.5 py-1.5 text-red-500 dark:text-red-300"
                  variant="ghost"
                  onClick={handleDeleteItem(index)}
                  onKeyDown={handleDeleteItem(index)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={handleAddItem}
        onKeyDown={handleAddItem}
      >
        Add variable
      </Button>
    </div>
  );
}
