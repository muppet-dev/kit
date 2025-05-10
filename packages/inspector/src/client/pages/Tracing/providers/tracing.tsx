import { useConnection, useNotification } from "@/client/providers";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type TracingContextType = ReturnType<typeof useTracingManager>;

const TracingContext = createContext<TracingContextType | null>(null);

const TRACES_METHODS = [
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

export enum TraceTab {
  TRACES = "traces",
  NOTIFICATIONS = "notifications",
  ERRORS = "errors",
}

export enum SortingEnum {
  ASCENDING = 1,
  DESCENDING = -1,
}

function useTracingManager() {
  const { requestHistory } = useConnection();
  const { notifications, stdErrNotifications } = useNotification();

  const [tab, setTab] = useState<{ value: TraceTab; methods?: string[] }>({
    value: TraceTab.TRACES,
    methods: TRACES_METHODS,
  });

  function changeTab(value: TraceTab) {
    setTab({
      value,
      methods: value === TraceTab.TRACES ? TRACES_METHODS : undefined,
    });
  }

  const [selected, setSelected] = useState<string | null>(null);

  const [methodFilters, setMethodFilters] = useState<string[] | null>(null);
  const [timestampSort, setTimestampSort] = useState<SortingEnum>(
    SortingEnum.ASCENDING,
  );

  const rawTraces = useMemo(() => {
    return tab.value === TraceTab.TRACES
      ? requestHistory
      : tab.value === TraceTab.NOTIFICATIONS
        ? notifications
        : stdErrNotifications;
  }, [tab, requestHistory, notifications, stdErrNotifications]);

  const traces = useMemo(() => {
    const _methodFilters = methodFilters ?? tab.methods;

    let results = rawTraces.filter(
      (item) =>
        _methodFilters?.includes(
          "request" in item ? JSON.parse(item.request).method : item.method,
        ) ?? true,
    );

    results = results.sort((a, b) => {
      const aTimestamp = a.timestamp.start;
      const bTimestamp = b.timestamp.start;

      return timestampSort === SortingEnum.ASCENDING
        ? aTimestamp - bTimestamp
        : bTimestamp - aTimestamp;
    });

    return results.map((item) => {
      if ("request" in item) {
        return {
          id: item.id,
          timestamp: item.timestamp,
          sRequest: item.request,
          sResponse: item.response,
          request: JSON.parse(item.request),
          response: item.response ? JSON.parse(item.response) : undefined,
        };
      }

      return {
        id: item.id,
        timestamp: item.timestamp,
        sRequest: JSON.stringify(item.params),
        request: item.params,
      };
    });
  }, [rawTraces, tab, methodFilters, timestampSort]);

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
    tab,
    changeTab,
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
