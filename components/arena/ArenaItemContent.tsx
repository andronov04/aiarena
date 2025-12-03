"use client";

import { CircleSlashIcon, RadioIcon, BadgeInfoIcon } from "lucide-react";
import { ModelGeneration, GenerationStatus } from "@/types/generation";
import { ArenaItemIframe } from "@/components/arena/ArenaItemIframe";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ArenaItemContent = ({ item }: { item: ModelGeneration }) => {
  const { status, content, error } = item;

  // IDLE
  if (status === GenerationStatus.IDLE) {
    return (
      <div className="w-full h-full text-xs md:text-base flex flex-col gap-2 p-4 items-center justify-center">
        <CircleSlashIcon />
        <span>Not generated yet</span>
      </div>
    );
  }

  // LOADING
  if (status === GenerationStatus.PROCESSING) {
    return (
      <div className="w-full h-full text-xs md:text-base flex flex-col gap-2 p-4 items-center justify-center">
        <RadioIcon className="animate-spin" />
        <span>Generating...</span>
      </div>
    );
  }

  // ERROR
  if (status === GenerationStatus.ERROR) {
    return (
      <div className="w-full h-full text-xs md:text-base flex flex-col gap-2 p-4 items-center justify-center text-destructive">
        <Tooltip>
          <TooltipTrigger>
            <BadgeInfoIcon />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-md">{error || "Unknown error"}</p>
          </TooltipContent>
        </Tooltip>
        <span>Something went wrong</span>
      </div>
    );
  }

  // SUCCESS
  return <ArenaItemIframe content={content || ""} />;
};
