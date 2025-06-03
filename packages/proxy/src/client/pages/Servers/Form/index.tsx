import { FieldErrorMessage } from "@/client/components/FieldErrorMessage";
import { Button } from "@/client/components/ui/button";
import { DialogClose } from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Spinner } from "@/client/components/ui/spinner";
import { eventHandler } from "@/client/lib/eventHandler";
import { generateName } from "@/client/lib/utils";
import { serversDataQueryKey } from "@/client/queries/useServersData";
import { configValidation as schema } from "@/client/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transport } from "@muppet-kit/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { OptionalFields } from "./OptionalFields";

export type ServerForm =
  | { type: "add"; onSubmit?: () => void }
  | {
      type: "edit";
      data?: Record<string, any>;
    };

export function ServerForm(props: ServerForm) {
  const queryClient = useQueryClient();

  const data = props.type === "edit" ? props.data : undefined;

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data ?? {
      type: Transport.STDIO,
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
    reset,
  } = methods;

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const _values = {
        ...values,
        name:
          values.name && values.name.trim().length > 0
            ? values.name
            : generateName(),
      };

      if (_values.type === Transport.STDIO && _values.env) {
        // @ts-expect-error: converting data from array of object to string in order to store it in local storage
        _values.env =
          _values.env.length > 0
            ? JSON.stringify(
                Object.fromEntries(
                  _values.env.map((item) => [item.key, item.value])
                )
              )
            : undefined;
      }

      if (props.type === "add")
        await fetch("/api/servers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_values),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(
              "Failed to save configuration. Please check your network connection or try again later."
            );
          }
          props.onSubmit?.();
        });
      else
        await fetch("/api/servers", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_values),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(
              "Failed to save configuration. Please check your network connection or try again later."
            );
          }
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serversDataQueryKey,
      });

      toast.success(
        props.type === "add"
          ? "Server added successfully!"
          : "Configuration saved successfully!"
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const isFormSubmitting = mutation.isPending || isSubmitting;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  const handleResetForm = eventHandler(() => reset(data));

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error
        )}
        className="size-full overflow-y-auto"
      >
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter server name"
            />
            <FieldErrorMessage name="name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="type" required>
              Transport Type
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger
                    id="type"
                    className="w-full data-[state=closed]:hover:[&>svg]:opacity-100 data-[state=open]:[&>svg]:opacity-100 transition-all ease-in-out [&>svg]:transition-all [&>svg]:ease-in-out"
                  >
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Transport.STDIO}>STDIO</SelectItem>
                    <SelectItem value={Transport.SSE}>SSE</SelectItem>
                    <SelectItem value={Transport.HTTP}>
                      HTTP Streaming
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <OptionalFields />
        </div>
        <div className="flex justify-between mt-4 max-w-4xl mx-auto w-full">
          {props.type === "edit" ? (
            <Button
              variant="outline"
              onClick={handleResetForm}
              onKeyDown={handleResetForm}
            >
              Reset
            </Button>
          ) : (
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          )}
          <Button type="submit" disabled={isFormSubmitting}>
            {isFormSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
            {isFormSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
