import { SortingEnum } from "@/client/lib/utils";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useConnection, useNotification } from "../../../providers";

type HistoryContextType = ReturnType<typeof useHistoryManager>;

const HistoryContext = createContext<HistoryContextType | null>(null);

const HISTORY_METHODS = [
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
  "notifications/roots/list_changed",
  "logging/setLevel",
];

export const HistoryProvider = (props: PropsWithChildren) => {
  const values = useHistoryManager();

  return (
    <HistoryContext.Provider value={values}>
      {props.children}
    </HistoryContext.Provider>
  );
};

export enum HistoryTab {
  HISTORY = "history",
  NOTIFICATIONS = "notifications",
  ERRORS = "errors",
}

function useHistoryManager() {
  const { requestHistory } = useConnection();
  const { notifications, stdErrNotifications } = useNotification();

  const [tab, setTab] = useState<{ value: HistoryTab; methods?: string[] }>({
    value: HistoryTab.HISTORY,
    methods: HISTORY_METHODS,
  });

  function changeTab(value: HistoryTab) {
    setTab({
      value,
      methods: value === HistoryTab.HISTORY ? HISTORY_METHODS : undefined,
    });
  }

  const [selected, setSelected] = useState<string | null>(null);

  const [methodFilters, setMethodFilters] = useState<string[] | null>(null);
  const [timestampSort, setTimestampSort] = useState<SortingEnum>(
    SortingEnum.ASCENDING,
  );

  const rawTraces = useMemo(() => {
    return tab.value === HistoryTab.HISTORY
      ? requestHistory
      : tab.value === HistoryTab.NOTIFICATIONS
        ? notifications
        : stdErrNotifications;
  }, [tab, requestHistory, notifications, stdErrNotifications]);

  const traces = useMemo(() => {
    const _methodFilters = methodFilters ?? tab.methods;

    let results = rawTraces.filter(
      (item) =>
        _methodFilters?.includes(JSON.parse(item.request).method) ?? true,
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
      sResponse: "response" in item ? item.response : undefined,
      request: JSON.parse(item.request),
      response:
        "response" in item && typeof item.response === "string"
          ? JSON.parse(item.response)
          : undefined,
    }));
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

export const useHistory = () => {
  const context = useContext(HistoryContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};
