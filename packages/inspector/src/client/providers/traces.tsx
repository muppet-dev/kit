import type { Request } from "@modelcontextprotocol/sdk/types.js";
import { events } from "fetch-event-stream";
import { nanoid } from "nanoid";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConfig } from "./config";

type TracingContextType = ReturnType<typeof useTracingManager>;

const TracingContext = createContext<TracingContextType | null>(null);

export const TracingProvider = ({ children }: PropsWithChildren) => {
  const values = useTracingManager();

  return (
    <TracingContext.Provider value={values}>{children}</TracingContext.Provider>
  );
};

export type Trace = {
  id: string;
  session: string;
  mid: string;
  timestamp: {
    start: number;
    latency?: number;
  };
  request?: Request;
  response?: Record<string, any>;
};

function useTracingManager() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [filters, setFilters] = useState({
    sessions: new Set<string>(),
    methods: new Set<string>(),
  });

  const { proxyAddress, isTracingEnabled } = useConfig();

  useEffect(() => {
    const abort = new AbortController();

    const handler = async () => {
      if (!isTracingEnabled) return;

      const res = await fetch(`${proxyAddress}/api/subscribe`, {
        signal: abort.signal,
      });

      if (res.ok) {
        const stream = events(res, abort.signal);
        for await (const event of stream) {
          const eventData = event.data;

          if (!eventData) continue;

          const { at, session, from, message } = JSON.parse(eventData);

          if ("method" in message)
            setFilters((prev) => {
              prev.methods.add(message.method);
              prev.sessions.add(session);

              return {
                ...prev,
              };
            });

          setTraces((prev) => {
            const tmp = [...prev];

            if (from === "server") {
              const index = tmp.findIndex(
                (log) =>
                  log.mid != null &&
                  log.mid === message.id &&
                  log.session === session,
              );

              if (index !== -1) {
                const exisiting = tmp[index];
                tmp[index] = {
                  ...exisiting,
                  timestamp: {
                    ...exisiting.timestamp,
                    latency: at - exisiting.timestamp.start,
                  },
                  response: message,
                };
              } else {
                tmp.push({
                  id: nanoid(),
                  session,
                  timestamp: {
                    start: at,
                  },
                  mid: message.id,
                  request: message,
                });
              }
            } else {
              tmp.push({
                id: nanoid(),
                session,
                timestamp: {
                  start: at,
                },
                mid: message.id,
                request: message,
              });
            }

            return tmp;
          });
        }
      }
    };

    handler();

    // return () => {
    //   abort.abort();
    // };
  }, [proxyAddress, isTracingEnabled]);

  function clearTraces() {
    setTraces([]);
  }

  return {
    traces,
    filters: {
      methods: [...filters.methods],
      sessions: [...filters.sessions],
    },
    clearTraces,
  };
}

export const useTracing = () => {
  const context = useContext(TracingContext);

  if (!context) throw new Error("Missing TracingContext.Provider in the tree!");

  return context;
};
