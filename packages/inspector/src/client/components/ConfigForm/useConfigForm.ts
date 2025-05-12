import { CONFIG_STORAGE_KEY, useConfig } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { nanoid } from "nanoid";

export function useConfigForm() {
  const id = nanoid(6);
  const { setConnectionInfo } = useConfig();
  const [_, setConfigurations] = useLocalStorage<ConnectionInfo[] | null>(
    CONFIG_STORAGE_KEY
  );

  return useMutation({
    mutationFn: async (values: ConnectionInfo) => {
      const data = {
        ...values,
        [SUBMIT_BUTTON_KEY]: undefined,
      };

      const _values = data;

      if (_values.transportType === Transport.STDIO && _values.env) {
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

      setConnectionInfo(_values.id ? _values : { id, ..._values });
    },
    onSuccess: (_, values) => {
      const submit_type_value = values[SUBMIT_BUTTON_KEY];

      if (submit_type_value === DocumentSubmitType.SAVE_AND_CONNECT) {
        const newItem = values.id ? values : { ...values, id };
        setConfigurations((prev) => (prev ? [...prev, newItem] : [newItem]));
      }
    },
  });
}
