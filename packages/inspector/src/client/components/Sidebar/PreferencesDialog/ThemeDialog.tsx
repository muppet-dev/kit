import { generateName } from "@/client/lib/utils";
import { DEFAULT_THEME, usePreferences } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { CodeEditor } from "../../CodeEditor";
import { FieldErrorMessage } from "../../FieldErrorMessage";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { DialogType } from ".";
import { Spinner } from "../../ui/spinner";

const schema = z.object({
  name: z.string().optional(),
  variables: z.string(),
});

export type ThemeDialog = {
  open?: DialogType;
  onOpenChange: (open?: DialogType) => void;
};

export function ThemeDialog(props: ThemeDialog) {
  const data = props.open?.type === "edit" ? props.open.data : undefined;

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data ?? {
      variables: DEFAULT_THEME,
    },
  });

  const { setColorTheme, currentColorTheme, setCurrentColorTheme } =
    usePreferences();
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isSubmitting },
  } = methods;

  const mutations = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const name =
        values.name && values.name.trim().length > 0
          ? values.name
          : generateName();

      if (data) {
        setColorTheme((prev) => {
          const updated = { ...prev };

          if (data.name !== name) delete updated[data.name];

          updated[name] = values.variables;
          setCurrentColorTheme(name);
          return updated;
        });
      } else if (currentColorTheme.toLowerCase() !== name.toLowerCase()) {
        setColorTheme((prev) => {
          return {
            ...prev,
            [name]: values.variables,
          };
        });

        setCurrentColorTheme(name);
      } else {
        throw new Error(
          "Cannot add a theme with the same name as the current color theme"
        );
      }
    },
    onSuccess: () => {
      reset();
      props.onOpenChange?.();

      if (data) {
        toast.success("Theme updated successfully");
        return;
      }

      toast.success("Theme added successfully");
    },
    onError: (error) => {
      console.error(error.message);

      toast.error(error.message || "Failed to add theme");
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const formSubmitting = mutations.isPending || isSubmitting;

  return (
    <Dialog
      open={props.open?.type === "add" || props.open?.type === "edit"}
      onOpenChange={(open) => {
        if (!open) {
          props.onOpenChange?.();
          reset({
            variables: DEFAULT_THEME,
          });
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Theme" : "Add Theme"}</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(
              (data) => mutations.mutateAsync(data),
              console.error
            )}
          >
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter theme name"
                {...register("name")}
              />
              <FieldErrorMessage name="name" />
            </div>
            <div className="space-y-1">
              <Label required>Theme</Label>
              <Controller
                name="variables"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CodeEditor
                    value={value}
                    onValueChange={onChange}
                    className="h-[500px]"
                  />
                )}
              />
              <FieldErrorMessage name="variables" />
            </div>
            <div className="flex justify-between items-center">
              <DialogClose asChild>
                <Button colorScheme="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting && (
                  <Spinner className="size-4 min-w-4 min-h-4" />
                )}
                {formSubmitting ? "Submitting" : "Submit"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
