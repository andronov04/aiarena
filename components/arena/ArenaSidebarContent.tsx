"use client";

import * as React from "react";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ModelSidebarItem } from "@/components/arena/ModelSidebarItem";
import { Textarea } from "@/components/ui/textarea";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { ArenaModeToggle } from "@/components/arena/ArenaModeToggle";

export const ArenaSidebarContent = () => {
  // const [, setInputQuery] = useQueryState("input");

  const { setModalState, input, setInput } = useAppStore(
    (s) => ({
      setModalState: s.setModalState,
      input: s.input,
      setInput: s.setInput,
    }),
    shallow,
  );
  // useEffect(() => {
  //   setInputQuery(input ? input : null);
  // }, [input, setInputQuery]);
  const gens = useGenerationStore((s) => s.generations);

  return (
    <div className="space-y-2 mt-2 md:px-0 px-2">
      <div>
        <ArenaModeToggle />
      </div>
      <div className="pb-2">
        <Textarea
          value={input}
          autoFocus={false}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write message"
          className="text-xl! ring-0! max-h-32 resize-none shadow-none bg-background"
          rows={4}
        />
      </div>
      <div className="pl-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Selected models
          </h3>
          <span className="text-[10px] rounded-sm font-mono font-medium text-gray-400 dark:text-gray-500 bg-gray-200/50 dark:bg-[#222] px-1.5 py-0.5">
            {gens.length}
          </span>
        </div>
        {/*<Button variant={"ghost"} className="rounded-lg cursor-pointer text-xs text-center">*/}
        {/*  <PlusIcon/>*/}
        {/*</Button>*/}
      </div>
      <div className="">
        {gens.map((item) => (
          <ModelSidebarItem key={item.id} item={item} />
        ))}
        <Button
          onClick={() => {
            setModalState({
              key: "modalModels",
              data: {},
            });
          }}
          variant="outline"
          className="w-full mt-1 mb-2 cursor-pointer h-auto py-3! p-2 rounded-lg shadow-none"
        >
          <PlusIcon /> Add model
        </Button>
      </div>
    </div>
  );
};
