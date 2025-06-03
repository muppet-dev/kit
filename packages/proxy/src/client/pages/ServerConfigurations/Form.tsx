import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/client/components/ui/accordion";
import { Button } from "@/client/components/ui/button";
import { Checkbox } from "@/client/components/ui/checkbox";
import { Spinner } from "@/client/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  tools: z.array(z.string()).optional(),
  prompts: z.array(z.string()).optional(),
  staticResources: z.array(z.string()).optional(),
  dynamicResources: z.array(z.string()).optional(),
});

export function ConfigurationsForm(props: { data?: Record<string, any> }) {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((values) => console.log(values), console.error)}
        className="size-full overflow-y-auto"
      >
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <Accordion type="multiple" className="flex flex-col gap-2">
            <ToolAccordionItem
              title="Tools"
              value="tools"
              stats={props.data?.tools}
            />
            <ToolAccordionItem
              title="Prompts"
              value="prompts"
              stats={props.data?.prompts}
            />
            <ToolAccordionItem
              title="Static Resources"
              value="static-resources"
              stats={props.data?.static_resources}
            />
            <ToolAccordionItem
              title="Dynamic Resources"
              value="dynamic-resources"
              stats={props.data?.dynamic_resources}
            />
          </Accordion>
        </div>
        <div className="flex justify-end mt-4 max-w-4xl mx-auto w-full">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

type ToolAccordionItem = {
  value: string;
  title: string;
  stats?: {
    enabled: number;
    total: number;
  };
};

function ToolAccordionItem(props: ToolAccordionItem) {
  return (
    <AccordionItem
      value={props.value}
      className="border-b-0 p-2 border last:border bg-muted/50"
    >
      <AccordionTrigger className="justify-start hover:no-underline cursor-pointer py-0 [&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0">
        <span>{props.title}</span>
        <span className="flex-1" />
        <span className="text-xs text-muted-foreground self-center">{`${props.stats?.enabled} / ${props.stats?.total}`}</span>
      </AccordionTrigger>
      <AccordionContent className="pb-0 pt-2 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="relative group flex gap-2 p-2 border cursor-pointer bg-background hover:border-white/30 transition-all ease-in-out"
          >
            <Checkbox
              id={`tool-${index}`}
              className="group-hover:border-white/30 transition-all ease-in-out"
            />
            <div className="space-y-1">
              <p className="leading-none">Tool Title</p>
              <p className="text-xs text-muted-foreground">Tool Description</p>
            </div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label
              htmlFor={`tool-${index}`}
              className="opacity-0 absolute inset-0 cursor-pointer"
            />
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
