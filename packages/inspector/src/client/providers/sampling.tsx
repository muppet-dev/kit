import type {
  CreateMessageRequest,
  CreateMessageResult,
} from "@modelcontextprotocol/sdk/types.js";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type SamplingContextType = ReturnType<typeof useSamplingManager>;

const SamplingContext = createContext<SamplingContextType | null>(null);

export const SamplingProvider = ({ children }: PropsWithChildren) => {
  const values = useSamplingManager();

  return (
    <SamplingContext.Provider value={values}>
      {children}
    </SamplingContext.Provider>
  );
};

export type PendingRequest = {
  id: number;
  request: CreateMessageRequest;
};

function useSamplingManager() {
  const [pendingSampleRequests, setPendingSampleRequests] = useState<
    Array<
      PendingRequest & {
        resolve: (result: CreateMessageResult) => void;
        reject: (error: Error) => void;
      }
    >
  >([]);
  const nextRequestId = useRef(0);

  return { pendingSampleRequests, setPendingSampleRequests, nextRequestId };
}

export const useSampling = () => {
  const context = useContext(SamplingContext);

  if (!context)
    throw new Error("Missing SamplingContext.Provider in the tree!");

  return context;
};
