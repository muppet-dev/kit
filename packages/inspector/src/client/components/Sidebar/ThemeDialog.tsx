import { usePreferences } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
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
  });

  const { setColorTheme, currentColorTheme } = usePreferences();
  const { handleSubmit, control, register } = methods;

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
            onSubmit={handleSubmit((data) => {
              setColorTheme((prev) => {
                if (currentColorTheme === data.name) {
                  toast.error("Theme already exists");
                  return prev;
                }

                return {
                  ...prev,
                  [data.name]: data.variables,
                };
              });
            })}
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
