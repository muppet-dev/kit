import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { transportSchema } from "@/validations";
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
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="env">Environmental Variables</Label>
        <EnvField />
      </div>
    </>
  );
}

const defaultEnvFieldValue = {
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

  return (
    <div className="col-span-3 space-y-2">
      {fields.length === 0 ? (
        <div className="h-[134px] w-full flex items-center justify-center border">
          <p className="text-sm select-none">No variables added</p>
        </div>
      ) : (
        fields.map((item, index, arr) => (
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
                onClick={() => move(index, index - 1)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") move(index, index - 1);
                }}
              >
                <ArrowUp />
              </Button>
              <Button
                title="Move Down"
                type="button"
                className="h-max has-[>svg]:px-1.5 py-1.5"
                variant="ghost"
                disabled={index === arr.length - 1}
                onClick={() => move(index, index + 1)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") move(index, index + 1);
                }}
              >
                <ArrowDown />
              </Button>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="space-y-1">
                <Label htmlFor={`env.${index}.key`}>key</Label>
                <Input {...register(`env.${index}.key`)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`env.${index}.value`}>Value</Label>
                <Input {...register(`env.${index}.value`)} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                title="Add"
                type="button"
                className="h-max has-[>svg]:px-1.5 py-1.5"
                variant="ghost"
                onClick={() => insert(index + 1, defaultEnvFieldValue)}
                onKeyDown={(event) => {
                  if (event.key === "Enter")
                    insert(index + 1, defaultEnvFieldValue);
                }}
              >
                <Plus />
              </Button>
              <Button
                title="Delete"
                type="button"
                className="h-max has-[>svg]:px-1.5 py-1.5 text-red-500 dark:text-red-300"
                variant="ghost"
                onClick={() => remove(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") remove(index);
                }}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={() => append(defaultEnvFieldValue)}
        onKeyDown={(event) => {
          if (event.key === "Enter") append(defaultEnvFieldValue);
        }}
      >
        Add variable
      </Button>
    </div>
  );
}
