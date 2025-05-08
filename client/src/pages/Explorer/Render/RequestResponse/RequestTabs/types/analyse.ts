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
