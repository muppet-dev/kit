import { Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import type { configTransportSchema } from "../../validations";
import { FieldErrorMessage } from "../FieldErrorMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ConfigurationField() {
  const { register, control } =
    useFormContext<z.infer<typeof configTransportSchema>>();

  return (
    <Accordion type="single" collapsible className="flex flex-col">
      <AccordionItem
        value="1"
        className="border-b-0 h-full flex flex-col [&>div]:data-[state=open]:h-full [&>div]:data-[state=open]:flex"
      >
        <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2 rounded-md">
          Configuration
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-0 h-full w-full flex flex-col gap-2">
          <Label htmlFor="request">Request Timeout</Label>
          <p className="text-xs text-muted-foreground">
            Timeout for requests to the MCP server (ms)
          </p>
          <Input
            id="request"
            type="number"
            {...register("request_timeout", {
              valueAsNumber: true,
            })}
          />
          <FieldErrorMessage name="request_timeout" />
          <div className="flex items-center gap-2 py-1">
            <Controller
              name="progress"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  id="progress"
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor="progress">Reset Timeout on Progress</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Reset timeout on progress notifications
              </TooltipContent>
            </Tooltip>
          </div>
          <FieldErrorMessage name="progress" />
          <Label htmlFor="total_timeout">Maximum Total Timeout</Label>
          <p className="text-xs text-muted-foreground">
            Maximum total timeout for requests sent to the MCP server (ms) (Use
            with progress notifications)
          </p>
          <Input
            id="total_timeout"
            type="number"
            {...register("total_timeout", {
              valueAsNumber: true,
            })}
          />
          <FieldErrorMessage name="total_timeout" />
          <Label htmlFor="proxy">Inspector Proxy Address</Label>
          <p className="text-xs text-muted-foreground">
            Set this if you are running the MCP Inspector Proxy on a non-default
            address. Example: http://10.1.1.22:5577
          </p>
          <Input id="proxy" {...register("proxy")} />
          <FieldErrorMessage name="proxy" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
