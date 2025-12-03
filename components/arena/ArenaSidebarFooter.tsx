"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import { useGeneration } from "@/hooks/use-generation";
import { ArrowRightIcon, SquareIcon } from "lucide-react";
import { GenerationStatus } from "@/types/generation";
import { useExamples } from "@/hooks/use-examples";

export const ArenaSidebarFooter = () => {
  const { hideExamples } = useExamples();
  const gens = useGenerationStore((s) => s.generations);
  const { generateAll, cancelAll } = useGeneration();
  const { input } = useAppStore((s) => ({ input: s.input }), shallow);

  const isDisabled = gens.length <= 0 || !input.length;

  const hasLoading = gens.some((g) => g.status === GenerationStatus.PROCESSING);

  return (
    <div className="w-full  md:px-0 px-2 md:pb-0 pb-2">
      {hasLoading ? (
        <Button
          onClick={() => cancelAll()}
          className="h-16 w-full text-2xl items-center cursor-pointer rounded-xl"
        >
          Cancel <SquareIcon className="size-8 fill-secondary" />
        </Button>
      ) : (
        <Button
          disabled={isDisabled}
          onClick={async () => {
            hideExamples();
            await generateAll();
          }}
          className="h-16 w-full text-2xl items-center cursor-pointer rounded-xl"
        >
          Generate <ArrowRightIcon className="size-8" />
        </Button>
      )}
    </div>
  );
};
