import { useQuery } from "@tanstack/react-query";

export const serversDataQueryKey = ["api", "servers"];

export function useServersData() {
  return useQuery({
    queryKey: serversDataQueryKey,
    queryFn: () =>
      fetch("/api/servers").then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch servers data. Please check your network connection or try again later.",
          );
        }

        return res.json() as Promise<Record<string, any>[]>;
      }),
  });
}
