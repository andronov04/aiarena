import { ModelGeneration } from "@/types/generation";
import { useAppStore } from "@/lib/providers/appProvider";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProviderView } from "@/components/arena/ProviderView";
import { shallow } from "zustand/vanilla/shallow";
import { useGenerationStore } from "@/lib/providers/generationProvider";

export const ModelSidebarItem = ({ item }: { item: ModelGeneration }) => {
  const { model, setModalState } = useAppStore(
    (s) => ({
      model: s.getModelById(item.modelId),
      setModalState: s.setModalState,
    }),
    shallow,
  );
  const { removeGeneration } = useGenerationStore(
    (s) => ({
      removeGeneration: s.removeGeneration,
    }),
    shallow,
  );
  //
  // const availableProviders = providers.filter((p) =>
  //   Object.keys(p.models).includes(model.id),
  // );
  if (!model) return null;

  return (
    <div className="flex gap-2 items-center justify-between p-2 rounded-xl">
      <div className="flex items-center gap-3">
        <div>
          <Checkbox
            onClick={() => {
              removeGeneration(item.id);
            }}
            className="cursor-pointer"
            checked={true}
          />
        </div>
        <div className="text-sm">
          <ProviderView item={item} />
          {/*<p className="font-normal text-muted-foreground text-xs">{model.id}</p>*/}
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
            className={"item__wrapper uppercase text-sm font-medium"}
          >
            {model.name}
          </div>
        </div>
      </div>
      <div>{/*<Checkbox className="cursor-pointer" checked={true} />*/}</div>
    </div>
  );
};
