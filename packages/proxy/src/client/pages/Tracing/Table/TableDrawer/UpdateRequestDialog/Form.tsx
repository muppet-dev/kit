import { CodeEditor } from "@/client/components/CodeEditor";
import type { Request } from "@modelcontextprotocol/sdk/types.js";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../components/ui/button";

export type UpdateRequestForm = {
  request: Request;
  closeDialog: () => void;
};

export function UpdateRequestForm({ request, closeDialog }: UpdateRequestForm) {
  const [value, setValue] = useState<string>();
  // JSON.stringify(request.params, null, 2)
  //   const { makeRequest } = useConnection();

  //   const mutation = useMutation({
  //     mutationFn: (values: ClientRequest) =>
  //       makeRequest(values, EmptyResultSchema.passthrough()),
  //     onSuccess: () => {
  //       toast.success("Request updated successfully!");

  //       closeDialog();
  //     },
  //     onError: (err) => {
  //       console.error(err);

  //       toast.error(err.message);
  //     },
  //   });

  //   const handleUpdateRequest = eventHandler(async () => {
  //     await mutation.mutateAsync({
  //       method: request.method as ClientRequest["method"],
  //       params: JSON.parse(value),
  //     });
  //   });

  return (
    <>
      <CodeEditor
        className="h-[400px]"
        value={value}
        onValueChange={(value) => {
          if (value) {
            setValue(value);
          }
        }}
      />
      <Button
        className="w-max ml-auto"
        // onClick={handleUpdateRequest}
        // onKeyDown={handleUpdateRequest}
        // disabled={mutation.isPending}
      >
        Send
        <SendHorizontal className="size-3.5" />
      </Button>
    </>
  );
}
