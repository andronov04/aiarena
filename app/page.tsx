import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { ArenaApp } from "@/components/arena/ArenaApp";
import { Model, Provider } from "@/lib/schemas/models";
import { AppProvider } from "@/lib/providers/appProvider";
import { loadSearchParams } from "./search-params";
import type { SearchParams } from "nuqs/server";
import {
  ArenaMode,
  GenerationStatus,
  ModelGeneration,
} from "@/types/generation";
import { generateUUID, sortModels } from "@/lib/utils";
import { ModalProviders } from "@/components/arena/modals/ModalProviders";
import { ModalModels } from "@/components/arena/modals/ModalModels";
import { ModalEnvManager } from "@/components/arena/modals/ModalEnvManager";
import { GenerationProvider } from "@/lib/providers/generationProvider";
import { DEFAULTS_MODELS, DISABLE_EXAMPLES } from "@/lib/constants";
import { DEFAULTS_DATA_MODELS } from "@/lib/defaults";
import { getPersist } from "@/lib/cookies/server";
import { ExampleGeneration } from "@/types/example";
import { fetchData } from "@/lib/fetch";

export const metadata: Metadata = {
  title: "AI Arena - AI Model Comparison Arena",
  description:
    "Compare 1000+ AI models across 68+ providers side-by-side. Client-side battleground for benchmarking LLMs with no backend—your API keys stay private.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const dataSearch = await loadSearchParams(searchParams);
  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get("sidebar_state")?.value === "true" ||
    cookieStore.get("sidebar_state") === undefined;

  const data =
    await fetchData<Promise<Record<string, Provider>>>("models.json");

  const providers: Provider[] = [];
  const models: Model[] = [];
  let input = dataSearch.input || "";

  // TODO: optimize
  for (const [, p] of Object.entries(data)) {
    providers.push({
      ...p,
    });
    for (const [mid, m] of Object.entries(p.models)) {
      const existModel = models.find((model) => model.id === mid);
      if (existModel || m.status === "deprecated") continue;
      models.push(m);
    }
  }

  const isShowExamples =
    (await getPersist("showExamples", true)) && !DISABLE_EXAMPLES;

  const generations: ModelGeneration[] = [];
  let mode: ArenaMode = "web";
  const examples = await fetchData<ExampleGeneration[]>("examples.json");
  if (isShowExamples) {
    const example = examples[0];
    if (example) {
      input = example.input;
      mode = example.mode;
      example.items.forEach((item) => {
        generations.push(item as any);
      });
    }
  } else if (dataSearch.data) {
    dataSearch.data?.forEach((item) => {
      generations.push({
        id: generateUUID(),
        modelId: item.m,
        providerId: item.p,
        status: GenerationStatus.IDLE,
      });
    });
  }

  // Set defaults models
  if (!generations.length && DEFAULTS_DATA_MODELS) {
    DEFAULTS_MODELS.split(",").forEach((item) => {
      const [pid, mid] = item.split("|");
      const model = models.find((model) => model.id === mid);
      const provider = providers.find((provider) => provider.id === pid);
      if (!provider || !model) return;
      generations.push({
        id: generateUUID(),
        modelId: mid,
        providerId: pid,
        status: GenerationStatus.IDLE,
      });
    });
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppProvider
        initialState={{
          providers: providers,
          models: sortModels(models),
          input: input,
          showExamples: isShowExamples,
          examples,
          mode,
        }}
      >
        <GenerationProvider
          initialState={{
            generations,
          }}
        >
          <>
            <AppSidebar />
            <SidebarInset>
              <ArenaApp />
            </SidebarInset>
            <ModalModels />
            <ModalProviders />
            <ModalEnvManager />
          </>
        </GenerationProvider>
      </AppProvider>
    </SidebarProvider>
  );
}
