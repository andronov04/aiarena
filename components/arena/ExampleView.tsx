import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExamples } from "@/hooks/use-examples";

export const ExampleView = () => {
  const {
    currentIndex,
    currentExample,
    examples,
    goToExample,
    goToPrevious,
    goToNext,
    hideExamples,
  } = useExamples();

  if (!currentExample) return null;

  return (
    <div className="max-w-7xl py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 justify-center">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Example {currentIndex + 1}
          </div>
          <div className="md:text-lg text-xs text-gray-800 dark:text-gray-200 font-semibold leading-tight">
            {currentExample.title}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center justify-center gap-2">
            <div className="md:flex hidden items-center gap-1.5">
              {examples.map((example, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => goToExample(index)}
                      className={`rounded-full cursor-pointer bg-primary transition-all duration-200 ${
                        currentIndex === index ? "w-8 h-2.5" : "w-2.5 h-2.5"
                      }`}
                      aria-label={`Go to example ${index + 1}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{example.title}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={goToPrevious}
                    aria-label="Previous example"
                  >
                    <ChevronLeftIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={hideExamples}
                    className="cursor-pointer"
                    aria-label="Hide examples"
                  >
                    <XIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hide examples</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={goToNext}
                    aria-label="Next example"
                  >
                    <ChevronRightIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
