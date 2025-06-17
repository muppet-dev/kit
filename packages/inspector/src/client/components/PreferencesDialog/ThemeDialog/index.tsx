import { generateName } from "@/client/lib/utils";
import { DEFAULT_THEME, usePreferences } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PencilLine, Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
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
import { Spinner } from "../../ui/spinner";
import { GenerateButtonGroup } from "./GenerateButtonGroup";
import { colorThemeValidation as schema } from "./validation";

export type ThemeDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Record<string, string>;
};

export function ThemeDialog({
  defaultValues,
  open,
  onOpenChange,
}: ThemeDialog) {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
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

      if (defaultValues) {
        setColorTheme((prev) => {
          const updated = { ...prev };

          if (defaultValues.name !== name) delete updated[defaultValues.name];

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
          "Cannot add a theme with the same name as the current color theme",
        );
      }
    },
    onSuccess: () => {
      reset();
      onOpenChange(false);

      if (defaultValues) {
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
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  const formSubmitting = mutations.isPending || isSubmitting;

  const DialogHeaderIcon = defaultValues ? PencilLine : Plus;
  const DialogTitleName = defaultValues ? "Edit Theme" : "Add Theme";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open)
          reset({
            variables: DEFAULT_THEME,
          });
      }}
    >
      <DialogContent className="sm:max-w-xl" isClosable={false}>
        <FormProvider {...methods}>
          <DialogHeader className="flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <DialogHeaderIcon className="size-6" />
                <DialogTitle>{DialogTitleName}</DialogTitle>
              </div>
              <DialogDescription className="hidden" />
            </div>
            <GenerateButtonGroup />
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(
              (data) => mutations.mutateAsync(data),
              console.error,
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
                {defaultValues
                  ? formSubmitting
                    ? "Saving"
                    : "Save"
                  : formSubmitting
                    ? "Adding"
                    : "Add"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
