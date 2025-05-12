import { getMCPProxyAddress } from "@/client/providers/connection/manager";
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

  useEffect(() => {
    const abort = new AbortController();

    const handler = async () => {
      const res = await fetch(`${getMCPProxyAddress()}/subscribe`, {
        signal: abort.signal,
      });

      if (res.ok) {
        const stream = events(res, abort.signal);
        for await (const event of stream) {
          setTraces((prev) => {
            const tmp = [...prev];
            if (event.data) {
              const data = JSON.parse(event.data);
              const { at, session, from, message } = data;

              if (from === "server") {
                const index = tmp.findIndex(
                  (log) => log.mid === message.id && log.session === session,
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
                    response: message,
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
  }, []);

  function clearTraces() {
    setTraces([]);
  }

  return {
    traces,
    clearTraces,
  };
}

export const useTracing = () => {
  const context = useContext(TracingContext);

  if (!context) throw new Error("Missing TracingContext.Provider in the tree!");

  return context;
};
