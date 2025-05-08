import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { transportSchema } from "@/validations";
import { useFormContext } from "react-hook-form";
import type z from "zod";

export function SSEFields() {
  const { register } = useFormContext<z.infer<typeof transportSchema>>();

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url">URL</Label>
        <Input
          className="col-span-3"
          placeholder="Enter URL"
          {...register("url")}
        />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline cursor-pointer hover:bg-accent/80 data-[state=open]:bg-accent/80 py-1.5 hover:px-2 data-[state=open]:px-2">
            Authentication
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-0 space-y-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bearerToken">Bearer Token</Label>
              <Input
                className="col-span-3"
                placeholder="Bearer Token"
                {...register("bearerToken")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="headerName">Header Name</Label>
              <Input
                className="col-span-3"
                placeholder="Authorization"
                {...register("headerName")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
