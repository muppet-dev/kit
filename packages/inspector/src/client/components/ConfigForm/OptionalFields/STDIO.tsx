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
import type { configTransportSchema } from "@/client/validations";
import { Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";

export function STDIOFields() {
  const { register } = useFormContext<z.infer<typeof configTransportSchema>>();

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
    useFormContext<z.infer<typeof configTransportSchema>>();

  const { fields, append, remove } = useFieldArray({
    name: "env",
    control,
  });

  const handleAddItem = eventHandler(() => append(ENV_FIELD_DEFAULT_VALUE));
  const handleDeleteItem = (index: number) => eventHandler(() => remove(index));

  return (
    <div className="space-y-2">
      {fields.length === 0 ? (
        <div className="h-[78px] w-full flex items-center justify-center border">
          <p className="text-sm select-none">No variables added</p>
        </div>
      ) : (
        <div className=" h-full overflow-y-auto space-y-1">
          {fields.map((item, index, arr) => (
            <div key={item.id} className="flex w-full items-center gap-2">
              <div className="flex w-full">
                <Input {...register(`env.${index}.key`)} placeholder="Key" />
                <Input
                  {...register(`env.${index}.value`)}
                  placeholder="Value"
                />
              </div>
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
