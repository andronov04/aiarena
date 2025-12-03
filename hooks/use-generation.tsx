import { useRef } from "react";
import { GenerationStatus } from "@/types/generation";
import {
  useGenerationStore,
  useGenerationStoreApi,
} from "@/lib/providers/generationProvider";
import { getModelExecutor } from "@/lib/ai/providers";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import { SYSTEM_INSTRUCTION_WEB } from "@/lib/constants";
import { stripMarkdownFences } from "@/lib/utils";

export const useGeneration = () => {
  const api = useGenerationStoreApi();
  const generations = useGenerationStore((s) => s.generations);

  const { providers, input, instructions, providerEnvs } = useAppStore(
    (s) => ({
      providers: s.providers,
      input: s.input,
      instructions: s.instructions,
      providerEnvs: s.providerEnvs,
    }),
    shallow,
  );

  const { setLoading, setSuccess, setError, setIdle } = useGenerationStore(
    (s) => ({
      setLoading: s.setLoading,
      setSuccess: s.setSuccess,
      setError: s.setError,
      setIdle: s.setIdle,
    }),
  );

  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const isStillActive = (id: string) => {
    const gen = api.getState().getById(id);
    return gen && gen.status === GenerationStatus.PROCESSING;
  };

  const generateOne = async (id: string) => {
    abortControllersRef.current.get(id)?.abort();

    const gen = api.getState().getById(id);
    if (!gen) throw new Error("No generation found");

    const provider = providers.find((p) => p.id === gen.providerId);
    if (!provider) throw new Error("No provider found");

    const model = provider.models[gen.modelId];
    if (!model) throw new Error("No model found");

    const env = Object.assign({}, ...Object.values(providerEnvs));
    const executor = getModelExecutor(provider, model, env);

    const ac = new AbortController();
    abortControllersRef.current.set(id, ac);
    setLoading(id);

    try {
      const response = await executor.doGenerate({
        prompt: [
          { role: "system", content: instructions || SYSTEM_INSTRUCTION_WEB },
          { role: "user", content: [{ type: "text", text: input }] },
        ],
        abortSignal: ac.signal,
      });

      const preContent = response.content
        .filter((a) => a.type === "text")
        .map((a) => a.text)
        .join("");
      const content = stripMarkdownFences(preContent);

      if (!content) throw new Error("No content");

      if (!isStillActive(id)) return;

      setSuccess(id, content);
    } catch (e: any) {
      if (e.name === "AbortError") return;

      if (!isStillActive(id)) return;

      setError(id, e.message || "Generation failed");
    } finally {
      abortControllersRef.current.delete(id);
    }
  };

  const generateAll = async () => {
    await Promise.allSettled(
      api
        .getState()
        .generations.map((gen) => generateOne(gen.id).catch(() => null)),
    );
  };

  const cancelAll = () => {
    abortControllersRef.current.forEach((c) => c.abort());
    abortControllersRef.current.clear();

    api.getState().generations.forEach((g) => {
      if (g.status === GenerationStatus.PROCESSING) setIdle(g.id);
    });
  };

  return {
    generations,
    generateOne,
    generateAll,
    cancelAll,
  };
};
