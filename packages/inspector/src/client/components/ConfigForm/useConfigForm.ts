import { generateName } from "@/client/lib/utils";
import { CONFIG_STORAGE_KEY, useConfig } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";

export function useConfigForm() {
  const { setConnectionInfo } = useConfig();
  const [_, setConfigurations] = useLocalStorage<ConnectionInfo[] | null>(
    CONFIG_STORAGE_KEY
  );

  return useMutation({
    mutationFn: async (values: ConnectionInfo) => {
      const _values = {
        ...values,
        name:
          values.name && values.name.trim().length > 0
            ? values.name
            : generateName(),
        [SUBMIT_BUTTON_KEY]: undefined,
      };

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

      setConnectionInfo(_values);

      return _values;
    },
    onSuccess: (values, formData) => {
      const submit_type_value = formData[SUBMIT_BUTTON_KEY];

      if (submit_type_value === DocumentSubmitType.SAVE_AND_CONNECT) {
        setConfigurations((prev) => {
          const tmp = prev ? [...prev] : [];
          const index = tmp.findIndex((item) => item.name === values.name);

          if (index !== -1) {
            tmp[index] = values;
          } else {
            tmp.push(values);
          }

          return tmp;
        });
      }
    },
  });
}
