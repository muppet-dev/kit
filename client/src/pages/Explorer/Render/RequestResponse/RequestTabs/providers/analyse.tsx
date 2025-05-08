import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type AnalyseContextType = ReturnType<typeof useAnalyseManager>;

const AnalyseContext = createContext<AnalyseContextType | null>(null);

export const AnalyseProvider = (props: PropsWithChildren) => {
  const values = useAnalyseManager();

  return (
    <AnalyseContext.Provider value={values}>
      {props.children}
    </AnalyseContext.Provider>
  );
};

export enum AnalyseSeverity {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export type AnalyseDataType = {
  score: number;
  recommendations: {
    category: string;
    description: string;
    severity: AnalyseSeverity;
  }[];
};

function useAnalyseManager() {
  const [data, setData] = useState<AnalyseDataType>();

  const setAnalyseData = (value: AnalyseDataType) => setData(value);

  return { analyseData: data, setAnalyseData };
}

export const useAnalyse = () => {
  const context = useContext(AnalyseContext);

  if (!context) throw new Error("Missing AnalyseContext.Provider in the tree!");

  return context;
};
