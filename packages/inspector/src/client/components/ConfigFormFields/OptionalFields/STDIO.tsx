import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { eventHandler } from "../../../lib/eventHandler";
import type { configTransportSchema } from "../../../validations";
import { Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";

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
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2">
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

  return (
    <>
      {fields.length === 0 ? (
        <div className="h-[36px] w-full flex items-center justify-center border">
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
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={handleAddItem}
        onKeyDown={handleAddItem}
        className="w-max"
      >
        Add variable
      </Button>
    </>
  );
}
