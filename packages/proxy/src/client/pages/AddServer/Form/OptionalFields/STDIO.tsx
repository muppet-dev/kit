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
import { Plus, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";

export function STDIOFields() {
  const { register } = useFormContext<z.infer<typeof configValidation>>();

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
        <FieldErrorMessage name="command" />
      </div>
      <div className="grid grid-cols-4 w-full items-center gap-2">
        <Label htmlFor="arguments">Arguments</Label>
        <Input
          className="col-span-3 text-md"
          placeholder="Enter arguments"
          {...register("args")}
        />
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
      <Button
        type="button"
        variant="ghost"
        onClick={handleAddItem}
        onKeyDown={handleAddItem}
        className="w-max"
      >
        <Plus />
        Add Variable
      </Button>
    </>
  );
}
