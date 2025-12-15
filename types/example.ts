import { ArenaMode, ModelGeneration } from "@/types/generation";

export interface ExampleGeneration {
  id: string;
  input: string;
  title: string;
  mode: ArenaMode;
  items: ModelGeneration[];
}
