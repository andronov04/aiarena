import { GenerationStatus, ModelGeneration } from "@/types/generation";
import * as React from "react";

export const useGenerationTimer = (item: ModelGeneration) => {
  // eslint-disable-next-line react-hooks/purity
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    if (item.status !== GenerationStatus.PROCESSING) {
      return;
    }

    setCurrentTime(Date.now());

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, [item.status, item.startTime]);

  const getDisplayTime = () => {
    if (item.status === GenerationStatus.SUCCESS && item.duration) {
      return item.duration;
    }

    if (item.status === GenerationStatus.PROCESSING && item.startTime) {
      return currentTime - item.startTime;
    }

    return null;
  };

  const displayTime = getDisplayTime();

  if (displayTime === null) return null;

  const seconds = (displayTime / 1000).toFixed(1);
  return `${seconds}s`;
};
