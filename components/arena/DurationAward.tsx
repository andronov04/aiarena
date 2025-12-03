import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RabbitIcon, SnailIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const DurationAward = ({ fastest }: { fastest: boolean }) => {
  const Icon = fastest ? RabbitIcon : SnailIcon;
  const label = fastest ? "Fastest" : "Slowest";
  const tooltipText = fastest
    ? "🏆 Speed demon! This combo blazed through generation faster than all others"
    : "🐌 Took its sweet time... but hey, slow and steady wins the race (sometimes)";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1], // bouncy easing
            delay: fastest ? 0 : 0.1, // slowest появляется чуть позже
          }}
          className={cn(
            "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-normal transition-colors cursor-pointer",
            fastest
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
          )}
        >
          <Icon className="size-3.5" />
          <span>{label}</span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
