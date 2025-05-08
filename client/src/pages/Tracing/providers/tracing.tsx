import { useConnection } from "@/providers";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type TracingContextType = ReturnType<typeof useTracingManager>;

const TracingContext = createContext<TracingContextType | null>(null);

export const AVAILABLE_METHODS = [
  "initialize",
  "ping",
  "tools/list",
  "tools/call",
  "resources/list",
  "resources/read",
  "prompts/list",
  "prompts/get",
  "resources/templates/list",
  "completion/complete",
];

export const TracingProvider = (props: PropsWithChildren) => {
  const values = useTracingManager();

  return (
    <TracingContext.Provider value={values}>
      {props.children}
    </TracingContext.Provider>
  );
};

export enum SortingEnum {
  ASCENDING = 1,
  DESCENDING = -1,
}

function useTracingManager() {
  const { requestHistory } = useConnection();
  const [selected, setSelected] = useState<string | null>(null);
  const [methodFilters, setMethodFilters] =
    useState<string[]>(AVAILABLE_METHODS);
  const [timestampSort, setTimestampSort] = useState<SortingEnum>(
    SortingEnum.ASCENDING
  );

  const traces = useMemo(() => {
    let results = requestHistory.filter((item) =>
      methodFilters.includes(JSON.parse(item.request).method)
    );

    results = results.sort((a, b) => {
      const aTimestamp = a.timestamp.start;
      const bTimestamp = b.timestamp.start;

      return timestampSort === SortingEnum.ASCENDING
        ? aTimestamp - bTimestamp
        : bTimestamp - aTimestamp;
    });

    return results.map((item) => ({
      id: item.id,
      timestamp: item.timestamp,
      sRequest: item.request,
      sResponse: item.response,
      request: JSON.parse(item.request),
      response: item.response ? JSON.parse(item.response) : undefined,
    }));
  }, [requestHistory, methodFilters, timestampSort]);

  function changeMethodFilters(method: string | string[]) {
    setMethodFilters((prev) => {
      if (Array.isArray(method)) {
        return method;
      }

      const updated = [...prev];
      if (updated.includes(method)) {
        updated.splice(updated.indexOf(method), 1);
      } else {
        updated.push(method);
      }
      return updated;
    });
  }

  function toggleTimestampSort() {
    setTimestampSort((prev) => {
      return prev === SortingEnum.ASCENDING
        ? SortingEnum.DESCENDING
        : SortingEnum.ASCENDING;
    });
  }

  return {
    traces,
    selected,
    setSelected,
    methodFilters,
    changeMethodFilters,
    timestampSort,
    toggleTimestampSort,
  };
}

export const useTracing = () => {
  const context = useContext(TracingContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};
