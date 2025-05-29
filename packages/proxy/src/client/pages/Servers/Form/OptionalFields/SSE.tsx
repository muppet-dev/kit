import { CopyButton } from "@/client/components/CopyButton";
import { FieldErrorMessage } from "@/client/components/FieldErrorMessage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/client/components/ui/accordion";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import type { configValidation } from "@/client/validations";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export function SSEFields() {
  const { register } = useFormContext<z.infer<typeof configValidation>>();

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="url" required>
          URL
        </Label>
        <URLField />
        <FieldErrorMessage name="url" />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2">
            Authentication
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 space-y-2">
            <div className="space-y-1">
              <Label htmlFor="bearerToken">Bearer Token</Label>
              <Input
                id="bearerToken"
                placeholder="Bearer Token"
                {...register("bearerToken")}
              />
              <FieldErrorMessage name="bearerToken" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="headerName">Header Name</Label>
              <Input
                id="headerName"
                placeholder="Authorization"
                {...register("headerName")}
              />
              <FieldErrorMessage name="headerName" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function URLField() {
  const { register, control } =
    useFormContext<z.infer<typeof configValidation>>();

  const url = useWatch({ control, name: "url" });

  return (
    <div className="relative flex items-center">
      <Input
        id="url"
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
