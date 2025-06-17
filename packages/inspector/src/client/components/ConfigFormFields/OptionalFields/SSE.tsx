import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import type { configTransportSchema } from "../../../validations";
import { CopyButton } from "../../CopyButton";
import { FieldErrorMessage } from "../../FieldErrorMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export function SSEFields() {
  const { register } = useFormContext<z.infer<typeof configTransportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 w-full items-center gap-2">
        <Label htmlFor="url" required>
          URL
        </Label>
        <URLField />
      </div>
      <FieldErrorMessage name="url" />
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2 rounded-md">
            Authentication
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 space-y-2">
            <div className="grid grid-cols-4 w-full items-center gap-2">
              <Label htmlFor="bearerToken">Bearer Token</Label>
              <Input
                className="col-span-3"
                placeholder="Bearer Token"
                {...register("bearerToken")}
              />
            </div>
            <FieldErrorMessage name="bearerToken" />
            <div className="grid grid-cols-4 w-full items-center gap-2">
              <Label htmlFor="headerName">Header Name</Label>
              <Input
                className="col-span-3"
                placeholder="Authorization"
                {...register("headerName")}
              />
            </div>
            <FieldErrorMessage name="headerName" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function URLField() {
  const { register, control } =
    useFormContext<z.infer<typeof configTransportSchema>>();

  const url = useWatch({ control, name: "url" });

  return (
    <div className="relative flex items-center col-span-3">
      <Input
        placeholder="Enter URL"
        {...register("url")}
        className="w-full pr-9"
      />
      <CopyButton
        className="absolute right-1"
        data={url}
        tooltipContent="Copy URL"
      />
    </div>
  );
}
