"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { List, RowComponentProps } from "react-window";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import { GenerationStatus } from "@/types/generation";
import { cn, generateUUID } from "@/lib/utils";
import { Model } from "@/lib/schemas/models";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { useEffect, useState } from "react";

// Define the props type for ModelRow
interface ModelRowProps {
  models: Model[];
  onSelectModel: (modelId: string, providerId?: string) => void;
  currentModelId?: string;
  currentProviderId?: string;
}

// Row component for react-window
const ModelRow: React.FC<RowComponentProps<ModelRowProps>> = ({
  index,
  style,
  models,
  currentProviderId,
  currentModelId,
  onSelectModel,
}) => {
  const model = models[index];
  const providers = useAppStore((s) => s.providers);
  const availableProviders = providers.filter((p) =>
    Object.keys(p.models).includes(model.id),
  );

  return (
    <div
      style={{
        ...style,
      }}
      className="hover:bg-accent justify-center cursor-pointer flex flex-col px-2 rounded-md hover:text-accent-foreground"
      onClick={() => {
        const providerId = availableProviders[0]?.id;
        onSelectModel(model.id, providerId);
      }}
      role="option"
      aria-selected="false"
    >
      <div className="flex gap-2 justify-between w-full">
        <div>
          {/*<p className="text-[10px] text-muted-foreground">{model.id}</p>*/}
          {/*<p className="text-[10px] text-muted-foreground">Model</p>*/}
          <b className="uppercase">{model.name}</b>
        </div>
        {model.id === currentModelId && (
          <CheckIcon className="size-4! text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground">Providers</p>
        <div className="text-[11px] flex overflow-y-auto gap-2">
          {availableProviders.map((p) => (
            <div
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectModel(model.id, p.id);
              }}
              className={cn(
                p.id === currentProviderId &&
                  model.id === currentModelId &&
                  "font-semibold underline",
                "text-nowrap hover:underline decoration-dashed",
              )}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function ModalModels() {
  const { modalState, setModalState, models } = useAppStore(
    (s) => ({
      modalState: s.modalState,
      setModalState: s.setModalState,
      models: s.models || [],
    }),
    shallow,
  );
  const { updateGeneration, addGeneration } = useGenerationStore(
    (s) => ({
      addGeneration: s.addGeneration,
      updateGeneration: s.updateGeneration,
    }),
    shallow,
  );
  const open = modalState?.key === "modalModels";
  const currentModelId = modalState?.data.modelId;
  const currentProviderId = modalState?.data.providerId;
  const [filteredModels, setFilteredModels] = useState<Model[]>(models || []);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const safeModels = models || [];
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredModels(safeModels);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredModels(
        safeModels.filter(
          (model) =>
            model.name.toLowerCase().includes(query) ||
            model.id.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, models]);

  const handleSelectModel = React.useCallback(
    (modelId: string, providerId: string) => {
      if (modalState?.data.genId) {
        updateGeneration(modalState?.data.genId, {
          modelId,
          providerId: providerId,
          status: GenerationStatus.IDLE,
        });
      } else {
        addGeneration({
          id: generateUUID(),
          modelId,
          providerId: providerId,
          status: GenerationStatus.IDLE,
        });
      }

      setModalState(undefined);
    },
    [modalState, updateGeneration, addGeneration, setModalState],
  );
  if (!open) return null;

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setModalState(undefined);
            setSearchQuery("");
          }
        }}
      >
        <CommandInput
          placeholder="Search models"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {filteredModels.length === 0 ? (
            <CommandEmpty>No model found.</CommandEmpty>
          ) : (
            <div className="p-1">
              <List
                rowComponent={ModelRow as any}
                rowCount={filteredModels.length}
                rowHeight={72}
                rowProps={{
                  models: filteredModels,
                  currentModelId,
                  currentProviderId,
                  onSelectModel: handleSelectModel,
                }}
                style={{ height: "400px", width: "100%" }}
              />
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
