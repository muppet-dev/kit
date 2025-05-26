import { DEFAULT_THEME, usePreferences } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { CodeEditor } from "../CodeEditor";
import { FieldErrorMessage } from "../FieldErrorMessage";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const schema = z.object({
  name: z.string(),
  variables: z.string(),
});

export type ThemeDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ThemeDialog(props: ThemeDialog) {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "default",
      variables: DEFAULT_THEME,
    },
  });

  const { setColorTheme, currentColorTheme, setCurrentColorTheme } =
    usePreferences();
  const { handleSubmit, control, register, reset } = methods;

  const mutations = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      if (currentColorTheme !== values.name) {
        setColorTheme((prev) => {
          return {
            ...prev,
            [values.name]: values.variables,
          };
        });

        setCurrentColorTheme(values.name);
      } else {
        throw new Error(
          "Cannot add a theme with the same name as the current color theme"
        );
      }
    },
    onSuccess: () => {
      reset();
      props.onOpenChange?.(false);

      toast.success("Theme added successfully");
    },
    onError: (error) => {
      console.error(error.message);

      toast.error(error.message || "Failed to add theme");
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Theme</DialogTitle>
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
              <Label required>Name</Label>
              <Input required {...register("name")} />
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
            <div className="flex justify-end items-center">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
