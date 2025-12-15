import { Globe, Paintbrush, Image, Box, Sparkles } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";
import { ArenaMode } from "@/types/generation";

const MODE_STYLES: Record<
  ArenaMode,
  {
    active: string;
    ring?: string;
  }
> = {
  web: {
    active: "data-[state=on]:bg-blue-500/15 data-[state=on]:text-blue-600",
  },
  canvas: {
    active: "data-[state=on]:bg-orange-500/15 data-[state=on]:text-orange-600",
  },
  svg: {
    active:
      "data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-600",
  },
  threejs: {
    active: "data-[state=on]:bg-purple-500/15 data-[state=on]:text-purple-600",
  },
  p5js: {
    active: "data-[state=on]:bg-pink-500/15 data-[state=on]:text-pink-600",
  },
};

function ModeItem({
  value,
  label,
  icon: Icon,
  description,
}: {
  value: ArenaMode;
  label: string;
  icon: React.ElementType;
  description: string;
}) {
  const styles = MODE_STYLES[value];

  return (
    <ToggleGroupItem
      value={value}
      aria-label={label}
      className={[
        "flex cursor-pointer items-center gap-1.5 px-2 py-1 text-xs",
        "transition-colors",
        "hover:bg-muted",
        styles.active,
      ].join(" ")}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex gap-1 cursor-pointer items-center">
            <Icon className="h-3! w-3!" />
            <span className="hidden sm:inline">{label}</span>
          </div>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="max-w-xs text-sm">
          {description}
        </TooltipContent>
      </Tooltip>
    </ToggleGroupItem>
  );
}

export function ArenaModeToggle() {
  const { mode, setMode } = useAppStore(
    (s) => ({
      mode: s.mode,
      setMode: s.setMode,
    }),
    shallow,
  );

  return (
    <ToggleGroup
      className="w-full px-1"
      type="single"
      value={mode}
      onValueChange={(value) => {
        if (value) setMode(value as ArenaMode);
      }}
    >
      <ModeItem
        value="web"
        label="Web"
        icon={Globe}
        description="Generate complete HTML, CSS, and JavaScript. Rendered in a sandboxed iframe directly in the browser."
      />

      <ModeItem
        value="canvas"
        label="Canvas"
        icon={Paintbrush}
        description="Generate pure JavaScript that draws on an HTML Canvas. Ideal for algorithms, generative art, and visual experiments."
      />

      <ModeItem
        value="svg"
        label="SVG"
        icon={Image}
        description="Generate scalable vector graphics (SVG). Perfect for icons, illustrations, diagrams, and animations."
      />

      <ModeItem
        value="threejs"
        label="Three.js"
        icon={Box}
        description="Generate interactive 3D scenes using Three.js via CDN. No build step, fully browser-based."
      />

      <ModeItem
        value="p5js"
        label="P5.js"
        icon={Sparkles}
        description="Creative coding with p5.js. Great for generative art, motion, and playful visual sketches."
      />
    </ToggleGroup>
  );
}
