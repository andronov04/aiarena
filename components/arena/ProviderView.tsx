"use client";
import { URL_LOGO_PROVIDER } from "@/lib/constants";
import { TriangleAlertIcon } from "lucide-react";
import { useAppStore } from "@/lib/providers/appProvider";
import { ModelGeneration } from "@/types/generation";
import { shallow } from "zustand/vanilla/shallow";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProviderNoEnv } from "@/components/arena/tooltips/TooltipProviderNoEnv";

export const ProviderView = ({ item }: { item: ModelGeneration }) => {
  const { setModalState, provider, hasAllEnv } = useAppStore(
    (s) => ({
      setModalState: s.setModalState,
      provider: s.getProviderById(item.providerId),
      hasAllEnv: s.hasAllEnv(item.providerId),
    }),
    shallow,
  );
  return (
    <div
      onClick={() => {
        setModalState({
          key: "modalProviders",
          data: {
            genId: item.id,
            providerId: item.providerId,
            modelId: item.modelId,
          },
        });
      }}
      className="item__wrapper text-xs"
    >
      {provider ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={provider.name}
            className="object-contain dark:invert size-3.5"
            src={`${URL_LOGO_PROVIDER}${provider.id}.svg`}
          />
          {provider.name}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setModalState({
                key: "modalEnvManager",
                data: {
                  genId: item.id,
                  providerId: item.providerId,
                  modelId: item.modelId,
                },
              });
            }}
          >
            {!hasAllEnv && <TooltipProviderNoEnv />}
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground">Select a provider</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <TriangleAlertIcon className="text-yellow-500" size={12} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select a provider for this model.</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};
