import { Radio } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { usePingServer } from "../../../../../providers";
import { Button } from "../../../../ui/button";
import { DialogClose, DialogFooter } from "../../../../ui/dialog";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";

const schema = z.object({
  interval: z.number().min(5),
});

export function CustomTimeIntervalForm(props: { onSubmit: () => void }) {
  const { setTimeInterval } = usePingServer();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      interval: 10,
    },
  });

  const handleCloseDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit((value) => {
        setTimeInterval(value.interval);
        props.onSubmit();
      }, console.error)}
    >
      <div>
        <Label className="mb-0.5 gap-1">
          Time Duration<span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Enter time duration in seconds
        </p>
        <Input
          type="number"
          min={5}
          {...register("interval", { valueAsNumber: true })}
        />
        {errors.interval && (
          <p className="text-destructive">{errors.interval.message}</p>
        )}
      </div>
      <DialogFooter className="mt-6 sm:justify-between">
        <DialogClose asChild>
          <Button
            variant="outline"
            onClick={handleCloseDialog}
            onKeyDown={handleCloseDialog}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          Start
          <Radio />
        </Button>
      </DialogFooter>
    </form>
  );
}
