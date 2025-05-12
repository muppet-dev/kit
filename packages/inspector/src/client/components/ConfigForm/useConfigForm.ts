import { CONFIG_STORAGE_KEY } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { ConfigForm } from ".";

export function useConfigForm(props: Pick<ConfigForm, "onSubmit">) {
  const id = nanoid(6);

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

      if (_values.id) props.onSubmit(_values);
      else props.onSubmit({ id, ..._values });
    },
    onSuccess: (_, values) => {
      const submit_type_value = values[SUBMIT_BUTTON_KEY];

      if (submit_type_value === DocumentSubmitType.SAVE_AND_CONNECT) {
        const localStorageValue = localStorage.getItem(CONFIG_STORAGE_KEY);

        const parsedValue = localStorageValue
          ? (JSON.parse(localStorageValue) as ConnectionInfo[])
          : undefined;

        if (parsedValue) {
          localStorage.setItem(
            CONFIG_STORAGE_KEY,
            JSON.stringify([...parsedValue, { id, ...values }])
          );
        } else
          localStorage.setItem(
            CONFIG_STORAGE_KEY,
            JSON.stringify([{ id, ...values }])
          );
      }
    },
  });
}
