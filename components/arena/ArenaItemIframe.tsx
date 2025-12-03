"use client";

import { useRef, useState } from "react";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import { ORIGINAL_WINDOW_HEIGHT, ORIGINAL_WINDOW_WIDTH } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ExpandIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ArenaItemIframe = ({ content }: { content?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { width = 0, height = 0 } = useWindowSize();

  useResizeObserver({
    ref: containerRef as any,
    onResize: ({ width, height }) => {
      if (!width || !height) return;
      const scaleX = width / ORIGINAL_WINDOW_WIDTH;
      const scaleY = height / ORIGINAL_WINDOW_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    },
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        isFullscreen &&
          "bg-black/80 fixed! rounded-none! top-0 left-0 inset-0 z-[60] animate-in fade-in duration-300",
        "w-full h-full rounded-xl group overflow-hidden relative",
      )}
    >
      <div
        className={
          "absolute opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-20 right-2 top-2 "
        }
      >
        <Button
          onClick={() => {
            setIsFullscreen(!isFullscreen);
          }}
          size="icon"
          className="cursor-pointer"
          variant="secondary"
        >
          {isFullscreen ? <XIcon /> : <ExpandIcon />}
        </Button>
      </div>

      <iframe
        srcDoc={content || ""}
        width={isFullscreen ? width : ORIGINAL_WINDOW_WIDTH}
        height={isFullscreen ? height : ORIGINAL_WINDOW_HEIGHT}
        sandbox="allow-same-origin allow-scripts"
        className="absolute  top-0 left-0"
        style={{
          transform: isFullscreen ? "" : `scale(${scale})`,
          transformOrigin: isFullscreen ? "" : "top left",
        }}
      />
    </div>
  );
};
