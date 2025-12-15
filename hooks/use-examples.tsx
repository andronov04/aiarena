import { useCallback, useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/providers/appProvider";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { setPersist } from "@/lib/cookies/client";
import { shallow } from "zustand/vanilla/shallow";

export const useExamples = () => {
  const { showExamples, examples, setShowExamples, setInput, setMode } =
    useAppStore(
      (s) => ({
        showExamples: s.showExamples,
        examples: s.examples,
        setShowExamples: s.setShowExamples,
        setInput: s.setInput,
        setMode: s.setMode,
      }),
      shallow,
    );

  const { clearGenerations, replaceGenerations } = useGenerationStore(
    (s) => ({
      clearGenerations: s.clearGenerations,
      replaceGenerations: s.replaceGenerations,
    }),
    shallow,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalExamples = examples.length;

  const currentExample = useMemo(
    () => examples[currentIndex],
    [examples, currentIndex],
  );

  useEffect(() => {
    if (!showExamples) return;
    if (currentExample) {
      replaceGenerations(currentExample.items);
      setInput(currentExample.input);
      setMode(currentExample.mode);
    }
  }, [showExamples, currentExample, replaceGenerations, setInput, setMode]);

  const goToExample = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalExamples) {
        setCurrentIndex(index);
      }
    },
    [totalExamples],
  );

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalExamples - 1));
  }, [totalExamples]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalExamples - 1 ? prev + 1 : 0));
  }, [totalExamples]);

  const hideExamples = useCallback(() => {
    setShowExamples(false);
    clearGenerations();
    setPersist("showExamples", false);
  }, [setShowExamples, clearGenerations]);

  const showExamplesHandler = useCallback(() => {
    setShowExamples(true);
    setPersist("showExamples", true);
    if (examples.length > 0) {
      setCurrentIndex(0);
    }
  }, [setShowExamples, examples.length]);

  const toggleExamples = useCallback(() => {
    if (showExamples) {
      hideExamples();
    } else {
      showExamplesHandler();
    }
  }, [showExamples, hideExamples, showExamplesHandler]);

  return {
    showExamples,
    currentIndex,
    currentExample,
    totalExamples,
    examples,

    goToExample,
    goToPrevious,
    goToNext,

    hideExamples,
    showExamplesHandler,
    toggleExamples,
  };
};
