import toast from "react-hot-toast";
import { generateName } from "@/client/lib/utils";
import { Transport } from "@muppet-kit/shared";
import { useMutation } from "@tanstack/react-query";
import type z from "zod";
import type { configValidation } from "@/client/validations";

export function useConfigForm() {
  return useMutation({
    mutationFn: async (values: z.infer<typeof configValidation>) => {
      const _values = {
        ...values,
        name:
          values.name && values.name.trim().length > 0
            ? values.name
            : generateName(),
      };

      if (_values.type === Transport.STDIO && _values.env) {
        // @ts-expect-error: converting data from array of object to string in order to store it in local storage
        _values.env =
          _values.env.length > 0
            ? JSON.stringify(
                Object.fromEntries(
                  _values.env.map((item) => [item.key, item.value])
                )
              )
            : undefined;
      }

      await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_values),
      });
    },
    onSuccess: () => {
      toast.success("Configuration saved successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
}
