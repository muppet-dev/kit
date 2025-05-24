import { generateName } from "@/client/lib/utils";
import { serversDataQueryKey } from "@/client/queries/useServersData";
import type { configValidation } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import type z from "zod";

export function useConfigForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      }).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to save configuration. Please check your network connection or try again later."
          );
        }

        navigate("/servers");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serversDataQueryKey,
      });

      toast.success("Configuration saved successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
}
