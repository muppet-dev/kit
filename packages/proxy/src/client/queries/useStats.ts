import { useQuery } from "@tanstack/react-query";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      fetch("/api/stats").then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch stats data. Please check your network connection or try again later."
          );
        }

        return res.json() as Promise<Record<string, number>>;
      }),
  });
}
