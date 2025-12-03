import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { Model, Provider } from "@/lib/schemas/models";
import { ExampleGeneration } from "@/types/example";

type ModalState =
  | {
      key: string;
      data: any;
    }
  | undefined;

export type AppState = {
  providers: Provider[];
  models: Model[];
  examples: ExampleGeneration[];

  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;

  input: string;
  instructions: string;

  setInput: (input: string) => void;
  setInstructions: (instructions: string) => void;

  showExamples: boolean;
  setShowExamples: (showExamples: boolean) => void;

  getProviderById: (pid: string) => Provider | undefined;
  getModelById: (mid: string) => Model | undefined;

  providerEnvs: Record<string, Record<string, string>>;
  getEnv: (providerId: string) => Record<string, string>;
  setEnvForKey: (key: string, value: string) => void;
  removeEnvForKey: (key: string) => void;
  hasAllEnv: (providerId: string) => boolean;
  getMissingEnv: (providerId: string) => string[];
};

export const defaultInitState: AppState = {
  providers: [],
  models: [],
  examples: [],

  modalState: undefined,
  setModalState: () => undefined,

  input: "",
  instructions: "",
  setInput: () => {},
  setInstructions: () => {},

  showExamples: false,
  setShowExamples: () => {},

  getProviderById: () => undefined,
  getModelById: () => undefined,

  providerEnvs: {},
  getEnv: () => ({}),
  setEnvForKey: () => {},
  removeEnvForKey: () => {},
  hasAllEnv: () => false,
  getMissingEnv: () => [],
};

export const createAppStore = (init?: Partial<AppState>) =>
  createStore<AppState>()(
    persist(
      (set, get) => ({
        ...defaultInitState,
        ...init,

        providerEnvs: {},

        getEnv: (providerId: string) => {
          return get().providerEnvs[providerId] || {};
        },

        setEnvForKey: (key: string, value: string) =>
          set((state) => {
            const updated = { ...state.providerEnvs };

            state.providers.forEach((provider) => {
              if (provider.env.includes(key)) {
                const prev = updated[provider.id] || {};
                updated[provider.id] = {
                  ...prev,
                  [key]: value,
                };
              }
            });

            return { providerEnvs: updated };
          }),

        removeEnvForKey: (key: string) =>
          set((state) => {
            const updated = { ...state.providerEnvs };

            state.providers.forEach((provider) => {
              if (provider.env.includes(key)) {
                const prev = updated[provider.id] || {};
                const next = { ...prev };
                delete next[key];
                updated[provider.id] = next;
              }
            });

            return { providerEnvs: updated };
          }),

        hasAllEnv: (providerId: string) => {
          const provider = get().providers.find((p) => p.id === providerId);
          if (!provider) return false;

          const saved = get().providerEnvs[providerId] || {};
          return provider.env.every((key) => saved[key]);
        },

        getMissingEnv: (providerId: string) => {
          const provider = get().providers.find((p) => p.id === providerId);
          if (!provider) return [];

          const saved = get().providerEnvs[providerId] || {};
          return provider.env.filter((key) => !saved[key]);
        },

        setInput: (input) =>
          set(() => ({
            input,
          })),
        setInstructions: (instructions) =>
          set(() => ({
            instructions,
          })),

        setModalState: (modalState) =>
          set(() => ({
            modalState,
          })),

        setShowExamples: (showExamples) =>
          set(() => ({
            showExamples,
          })),

        getProviderById: (pid: string) => {
          return get().providers.find((p) => p.id === pid);
        },

        getModelById: (mid: string) => {
          return get().models.find((m) => m.id === mid);
        },
      }),

      {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage),

        partialize: (state) => ({
          providerEnvs: state.providerEnvs,
          instructions: state.instructions,
        }),
      },
    ),
  );
