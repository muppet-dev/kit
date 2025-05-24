import { useQuery } from "@tanstack/react-query";

export function useServerData(options: { id?: string }) {
  return useQuery({
    queryKey: ["api", "servers", options.id],
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
