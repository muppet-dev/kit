import { useQuery } from "@tanstack/react-query";

export const getServerDataKey = (options: { id?: string }) => {
  const key = ["api", "servers"];
  if (options.id) key.push(options.id);
  return key;
};

export function useServerData(options: { id?: string }) {
  const queryKey = getServerDataKey(options);

  return useQuery({
    queryKey,
    queryFn: () =>
      fetch(`/api/servers/${options.id}`).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch stats data. Please check your network connection or try again later."
          );
        }

        return res.json() as Promise<Record<string, any>>;
      }),
    enabled: !!options.id,
  });
}
