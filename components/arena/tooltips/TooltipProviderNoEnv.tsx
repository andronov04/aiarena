import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TriangleAlertIcon } from "lucide-react";

export const TooltipProviderNoEnv = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TriangleAlertIcon className="text-red-500" size={12} />
      </TooltipTrigger>
      <TooltipContent>
        <p>Set up API keys to enable generation with this provider.</p>
      </TooltipContent>
    </Tooltip>
  );
};
