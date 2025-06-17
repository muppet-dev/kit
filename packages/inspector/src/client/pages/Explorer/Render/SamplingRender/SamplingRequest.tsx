import { DuckField } from "@/client/components/DuckField";
import { CodeHighlighter } from "@/client/components/Hightlighter";
import { FieldWrapper, quackFields } from "@/client/components/fields";
import { Button } from "@/client/components/ui/button";
import {
  Blueprint,
  DuckForm,
  type PendingRequest,
  useSampling,
} from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonSchemaType = {
  type:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | "null";
  description?: string;
  required?: boolean;
  label?: string;
  properties?: Record<string, JsonSchemaType>;
  items?: JsonSchemaType;
};

export type SamplingRequestProps = {
  request: PendingRequest;
};

const samplingValidation = z.object({
  message: CreateMessageResultSchema,
});

export function SamplingRequest({ request }: SamplingRequestProps) {
  const methods = useForm<z.infer<typeof samplingValidation>>({
    resolver: zodResolver(samplingValidation),
    defaultValues: {
      message: {
        model: "stub-model",
        stopReason: "endTurn",
        role: "assistant",
        content: {
          type: "text",
          text: "",
        },
      },
    },
  });
  const { setPendingSampleRequests } = useSampling();

  const { control, setValue, handleSubmit, reset } = methods;

  const contentType = useWatch({ control, name: "message.content.type" });

  const schema = useMemo(() => {
    const s: { message: JsonSchemaType } = {
      message: {
        type: "object",
        label: "Message",
        properties: {
          model: {
            type: "string",
            label: "Model",
          },
          stopReason: {
            type: "string",
            label: "Stop Reason",
          },
          role: {
            type: "string",
            label: "Role",
          },
          content: {
            type: "object",
            label: "Content",
            properties: {
              type: {
                type: "string",
                label: "Type",
              },
            },
          },
        },
      },
    };

    if (contentType === "text" && s.message.properties) {
      s.message.properties.content.properties = {
        ...s.message.properties.content.properties,
        text: {
          type: "string",
          description: "text content",
        },
      };

      setValue("message.content", {
        type: contentType,
        text: "",
      });
    } else if (contentType === "image" && s.message.properties) {
      s.message.properties.content.properties = {
        ...s.message.properties.content.properties,
        data: {
          type: "string",
          description: "Base64 encoded image data",
        },
        mimeType: {
          type: "string",
          description: "Mime type of the image",
        },
      };

      setValue("message.content", {
        type: contentType,
        data: "",
        mimeType: "",
      });
    }

    return s;
  }, [contentType, setValue]);

  const handleRejectSampling = (id: number) => {
    setPendingSampleRequests((prev) => {
      const request = prev.find((r) => r.id === id);
      request?.reject(new Error("Sampling request rejected"));
      return prev.filter((r) => r.id !== id);
    });
  };

  const id = request.id;

  return (
    <div
      data-testid="sampling-request"
      className="grid grid-cols-3 gap-4 border rounded-lg p-4 overflow-y-auto"
    >
      <form
        onSubmit={handleSubmit((values) => {
          try {
            setPendingSampleRequests((prev) => {
              const request = prev.find((r) => r.id === id);
              request?.resolve(values.message);
              return prev.filter((r) => r.id !== id);
            });

            reset();

            toast.success("Message result submitted successfully");
          } catch (error: any) {
            toast.error(
              `There was an error validating the message result: ${error.message}`,
            );

            console.error(error);
          }
        }, console.error)}
        className="flex-1 space-y-4 col-span-2"
      >
        <div className="space-y-2">
          <FormProvider {...methods}>
            <DuckForm
              components={quackFields}
              generateId={(_, props) =>
                props.id ? String(props.id) : undefined
              }
            >
              <Blueprint wrapper={FieldWrapper} schema={schema}>
                {Object.keys(schema).map((key) => (
                  <DuckField key={key} id={key} />
                ))}
              </Blueprint>
            </DuckForm>
          </FormProvider>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleRejectSampling(request.id)}
          >
            Reject
          </Button>
          <Button type="submit">Approve</Button>
        </div>
      </form>
      <CodeHighlighter
        content={JSON.stringify(request.request, null, 2)}
        className="h-max"
      />
    </div>
  );
}
