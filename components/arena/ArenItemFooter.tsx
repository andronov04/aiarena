import { GenerationStatus, ModelGeneration } from "@/types/generation";
import { ProviderView } from "@/components/arena/ProviderView";
import * as React from "react";
import { useGenerationTimer } from "@/hooks/use-generation-timer";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { DurationAward } from "@/components/arena/DurationAward";

export const ArenaItemFooter = ({ item }: { item: ModelGeneration }) => {
  const timerDisplay = useGenerationTimer(item);
  const awards = useGenerationStore((s) => s.getAwards());
  const itemAwards = awards[item.id];
  const { model, setModalState } = useAppStore(
    (s) => ({
      provider: s.getProviderById(item.providerId),
      model: s.getModelById(item.modelId),
      setModalState: s.setModalState,
    }),
    shallow,
  );
  if (!model) return null;

  return (
    <div className="flex flex-col gap-0.5 items-start justify-between">
      <div className="w-full px-2 flex items-center justify-between gap-2">
        <ProviderView item={item} />
        <div className="flex gap-2 items-center">
          {(itemAwards?.fastest || itemAwards?.slowest) && (
            <DurationAward fastest={!!itemAwards.fastest} />
          )}
          {((item.status === GenerationStatus.SUCCESS && item.duration) ||
            (timerDisplay && item.status === GenerationStatus.PROCESSING)) && (
            <div className="text-xs text-muted-foreground font-mono whitespace-nowrap">
              {item.duration
                ? `${(item.duration / 1000).toFixed(1)}s`
                : timerDisplay}
            </div>
          )}
        </div>
      </div>
      <div className="px-2">
        <div
          onClick={() => {
            setModalState({
              key: "modalModels",
              data: {
                modelId: item.modelId,
                providerId: item.providerId,
                genId: item.id,
              },
            });
          }}
          className="item__wrapper text-sm uppercase font-medium cursor-pointer"
          title={model.name}
        >
          {model.name}
        </div>
        <div></div>
      </div>
    </div>
  );
};
