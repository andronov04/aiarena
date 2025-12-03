import { ModelGeneration } from "@/types/generation";

export interface ExampleGeneration {
  id: string;
  input: string;
  title: string;
  items: ModelGeneration[];
}
