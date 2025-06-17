import { SortingEnum } from "@/client/lib/utils";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTracing } from "../../../providers";

type LogsContextType = ReturnType<typeof useLogsManager>;

const LogsContext = createContext<LogsContextType | null>(null);

export const LogsProvider = (props: PropsWithChildren) => {
  const values = useLogsManager();

  return (
    <LogsContext.Provider value={values}>{props.children}</LogsContext.Provider>
  );
};

function useLogsManager() {
  const { traces, filters: filterData } = useTracing();
  const [selected, setSelected] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    methods: string[] | null;
    sessions: string[] | null;
  }>({ methods: null, sessions: null });
  const [timestampSort, setTimestampSort] = useState<SortingEnum>(
    SortingEnum.ASCENDING,
  );

  const logs = useMemo(() => {
    let results = traces.filter(({ request, session }) => {
      const methodMatch =
        filters.methods?.includes(request?.method ?? "") ?? true;
      const sessionMatch = filters.sessions?.includes(session ?? "") ?? true;
      return methodMatch && sessionMatch;
    });
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
  }, [traces, filters, timestampSort]);

  const toggleFilterValue = (
    key: keyof typeof filters,
    value?: string | string[] | null,
  ) => {
    setFilters((prev) => {
      if (!value) return { ...prev, [key]: null };

      if (Array.isArray(value)) return { ...prev, [key]: value };

      const current = prev[key];
      const updated = current ? [...current] : [];
      if (updated.includes(value)) {
        updated.splice(updated.indexOf(value), 1);
      } else {
        updated.push(value);
      }

      return { ...prev, [key]: updated };
    });
  };

  function toggleTimestampSort() {
    setTimestampSort((prev) =>
      prev === SortingEnum.ASCENDING
        ? SortingEnum.DESCENDING
        : SortingEnum.ASCENDING,
    );
  }

  return {
    logs,
    selected,
    setSelected,
    methodFilters: filters.methods,
    sessionFilters: filters.sessions,
    toggleFilterValue,
    timestampSort,
    filterData,
    toggleTimestampSort,
  };
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");
  return context;
};
