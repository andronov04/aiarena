import * as React from "react";
import { ModelGeneration } from "@/types/generation";
import { ORIGINAL_WINDOW_HEIGHT, ORIGINAL_WINDOW_WIDTH } from "@/lib/constants";
import { ArenaItemContent } from "@/components/arena/ArenaItemContent";
import { ArenaItemFooter } from "@/components/arena/ArenItemFooter";

export const ArenaItem = ({ item }: { item: ModelGeneration }) => {
  return (
    <div className="space-y-2">
      <div
        style={{
          aspectRatio: `${ORIGINAL_WINDOW_WIDTH} / ${ORIGINAL_WINDOW_HEIGHT}`,
        }}
        className="bg-muted/50 rounded-xl"
      >
        <ArenaItemContent item={item} />
      </div>
      <ArenaItemFooter item={item} />
    </div>
  );
};
