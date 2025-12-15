export enum GenerationStatus {
  IDLE = "idle",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}

export interface ModelGeneration {
  id: string;
  modelId: string;
  providerId: string;
  status: GenerationStatus;
  content?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export type ArenaMode = "web" | "canvas" | "svg" | "threejs" | "p5js";
