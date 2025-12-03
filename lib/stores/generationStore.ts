import { createStore } from "zustand/vanilla";
import { GenerationStatus, ModelGeneration } from "@/types/generation";

export interface GenerationStoreState {
  generations: ModelGeneration[];

  addGeneration: (gen: ModelGeneration) => void;
  replaceGenerations: (gens: ModelGeneration[]) => void;
  setGeneration: (id: string, gen: Partial<ModelGeneration>) => void;
  updateGeneration: (id: string, patch: Partial<ModelGeneration>) => void;
  removeGeneration: (id: string) => void;
  clearGenerations: () => void;

  getById: (id: string) => ModelGeneration | undefined;

  setLoading: (id: string) => void;
  setSuccess: (id: string, content: any) => void;
  setError: (id: string, message: string) => void;
  setIdle: (id: string) => void;

  getAwards: () => Record<
    string,
    {
      fastest?: boolean;
      slowest?: boolean;
    }
  >;
}

export const createGenerationStore = (init?: Partial<GenerationStoreState>) =>
  createStore<GenerationStoreState>((set, get) => ({
    generations: [],
    ...init,

    replaceGenerations: (generations) =>
      set(() => ({
        generations,
      })),

    addGeneration: (gen) =>
      set((state) => ({
        generations: [...state.generations, gen],
      })),

    setGeneration: (id, gen) =>
      set((state) => {
        const next = state.generations.map((g) =>
          g.id === id ? { ...g, ...gen } : g,
        );
        return { generations: next };
      }),

    updateGeneration: (id, patch) =>
      set((state) => ({
        generations: state.generations.map((g) =>
          g.id === id ? { ...g, ...patch } : g,
        ),
      })),

    removeGeneration: (id) =>
      set((state) => ({
        generations: state.generations.filter((g) => g.id !== id),
      })),

    clearGenerations: () =>
      set((state) => ({
        generations: state.generations.map((a) => ({
          ...a,
          status: GenerationStatus.IDLE,
          startTime: undefined,
          duration: undefined,
          endTime: undefined,
          error: "",
          content: "",
        })),
      })),

    getById: (id) => get().generations.find((g) => g.id === id),

    setLoading: (id) =>
      get().updateGeneration(id, {
        status: GenerationStatus.PROCESSING,
        startTime: Date.now(),
        endTime: undefined,
        duration: undefined,
      }),

    setSuccess: (id, content) => {
      const gen = get().getById(id);
      const endTime = Date.now();
      const duration = gen?.startTime ? endTime - gen.startTime : undefined;

      get().updateGeneration(id, {
        status: GenerationStatus.SUCCESS,
        content,
        endTime,
        duration,
      });
    },

    setError: (id, message) =>
      get().updateGeneration(id, {
        status: GenerationStatus.ERROR,
        error: message,
        startTime: undefined,
        endTime: undefined,
        duration: undefined,
      }),

    setIdle: (id) =>
      get().updateGeneration(id, {
        status: GenerationStatus.IDLE,
        startTime: undefined,
        endTime: undefined,
        duration: undefined,
      }),

    getAwards: () => {
      const gens = get().generations;

      const hasProcessing = gens.some(
        (g) => g.status === GenerationStatus.PROCESSING,
      );

      if (hasProcessing) return {};

      const completed = gens.filter(
        (g) => g.status === GenerationStatus.SUCCESS && g.duration,
      );

      if (completed.length < 2) return {};

      const durations = completed.map((g) => g.duration!);
      const min = Math.min(...durations);
      const max = Math.max(...durations);

      const awards: Record<
        string,
        {
          fastest?: boolean;
          slowest?: boolean;
        }
      > = {};

      completed.forEach((g) => {
        awards[g.id] = {
          fastest: g.duration === min,
          slowest: g.duration === max,
        };
      });

      return awards;
    },
  }));
