"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Model, Provider } from "@/lib/schemas/models";
import { ProviderEnvManager } from "@/components/arena/ProviderEnvManager";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { GenerationStatus } from "@/types/generation";

export const ProvidersItemView = ({
  provider,
  isCurrent,
  providerModel,
  onSelectProvider,
  onClickTooltip,
}: {
  provider: Provider;
  providerModel: Model;
  onClickTooltip: (e: any) => void;
  isCurrent: boolean;
  onSelectProvider: (id: string) => void;
}) => {
  return (
    <CommandItem
      onSelect={() => {
        onSelectProvider(provider.id);
      }}
      className="flex-col items-start"
    >
      <div className="flex gap-2 w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <b>{provider.name}</b>
          {provider.doc && (
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={provider.doc}
              target="_blank"
            >
              <ExternalLinkIcon className="size-3.5!" />
            </a>
          )}
        </div>
        {isCurrent && <CheckIcon />}
      </div>
      <div className={"flex gap-2 items-center"}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <ArrowDownCircleIcon
                size={8}
                className=" text-muted-foreground"
              />
              <span>${providerModel.cost?.input ?? "-"}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Input cost per 1M tokens</p>
          </TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <ArrowUpCircleIcon size={8} className=" text-muted-foreground" />
              <span>${providerModel.cost?.output ?? "-"}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Output cost per 1M tokens</p>
          </TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <div onClick={onClickTooltip}>
          <ProviderEnvManager providerId={provider.id} />
        </div>
      </div>
    </CommandItem>
  );
};

export function ModalProviders() {
  const { modalState, setModalState, providers } = useAppStore(
    (s) => ({
      modalState: s.modalState,
      setModalState: s.setModalState,
      providers: s.providers || [],
    }),
    shallow,
  );
  const { updateGeneration } = useGenerationStore(
    (s) => ({
      updateGeneration: s.updateGeneration,
    }),
    shallow,
  );
  const open = modalState?.key === "modalProviders";
  const data = modalState?.data;
  const providerId = data?.providerId;
  const genId = data?.genId;
  const model = useAppStore((s) => s.getModelById(data?.modelId));
  const availableProviders = providers.filter(
    (p) => model && Object.keys(p.models).includes(model.id),
  );
  if (!open) return null;

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setModalState(undefined);
          }
        }}
      >
        <CommandInput
          placeholder={`Search providers supporting ${model?.name || "Unknown model"}`}
        />
        <CommandList className="p-1">
          <CommandEmpty>No provider found.</CommandEmpty>
          {availableProviders.map((p) => {
            if (!model?.id) return null;
            const providerModel = p.models[model.id];
            return (
              <ProvidersItemView
                onSelectProvider={(id) => {
                  if (genId) {
                    updateGeneration(genId, {
                      providerId: id,
                      status: GenerationStatus.IDLE,
                    });
                  }
                  setModalState(undefined);
                }}
                isCurrent={p.id === providerId}
                providerModel={providerModel}
                onClickTooltip={(e) => {
                  e.stopPropagation();
                  setModalState({
                    key: "modalEnvManager",
                    data: {
                      genId,
                      providerId: p.id,
                      modelId: providerModel.id,
                    },
                  });
                }}
                provider={p}
                key={p.id}
              />
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
