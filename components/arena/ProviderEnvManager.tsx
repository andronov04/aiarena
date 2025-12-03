"use client";

import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";

import { KeyRoundIcon } from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

export function ProviderEnvManager({ providerId }: { providerId: string }) {
  const { hasAllEnv } = useAppStore(
    (s) => ({
      hasAllEnv: s.hasAllEnv(providerId),
    }),
    shallow,
  );
  const color = hasAllEnv ? "text-blue-500" : "text-red-500";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-1 hover:opacity-80 cursor-pointer",
            color,
          )}
        >
          <KeyRoundIcon className={cn("size-3.5!", color)} />
          <span className="text-xs">
            {hasAllEnv ? "Keys set" : "Keys required"}
          </span>
        </div>
      </TooltipTrigger>

      <TooltipContent>
        {hasAllEnv
          ? "API keys set up"
          : "API keys required to use this provider"}
      </TooltipContent>
    </Tooltip>
  );
}
