import { useTracing } from "@/client/providers";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type LogsContextType = ReturnType<typeof useLogsManager>;

const LogsContext = createContext<LogsContextType | null>(null);

export const LogsProvider = (props: PropsWithChildren) => {
  const values = useLogsManager();

  return (
    <LogsContext.Provider value={values}>{props.children}</LogsContext.Provider>
  );
};

export enum SortingEnum {
  ASCENDING = 1,
  DESCENDING = -1,
}

function useLogsManager() {
  const { traces } = useTracing();

  const [selected, setSelected] = useState<string | null>(null);

  const [methodFilters, setMethodFilters] = useState<string[] | null>(null);
  const [timestampSort, setTimestampSort] = useState<SortingEnum>(
    SortingEnum.ASCENDING
  );

  const logs = useMemo(() => {
    let results = traces.filter(
      (item) => methodFilters?.includes(item.request?.method ?? "") ?? true
    );

    results = results.sort((a, b) => {
      const aTimestamp = a.timestamp.start;
      const bTimestamp = b.timestamp.start;

      return timestampSort === SortingEnum.ASCENDING
        ? aTimestamp - bTimestamp
        : bTimestamp - aTimestamp;
    });

    return results.map((item) => ({
      ...item,
      sRequest: item.request ? JSON.stringify(item.request) : undefined,
      sResponse: item.response ? JSON.stringify(item.response) : undefined,
    }));
  }, [traces, methodFilters, timestampSort]);

  function changeMethodFilters(method?: string | string[]) {
    setMethodFilters((prev) => {
      if (method == null) return null;
      if (Array.isArray(method)) return method;

      const updated = prev ? [...prev] : [];
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
    logs,
    selected,
    setSelected,
    methodFilters,
    changeMethodFilters,
    timestampSort,
    toggleTimestampSort,
  };
}

export const useLogs = () => {
  const context = useContext(LogsContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};
