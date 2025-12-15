"use client";

import { ArenaContent } from "@/components/arena/ArenaContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { GithubIcon } from "lucide-react";
import { ThemeModeToggle } from "@/components/base/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { AboutView } from "@/components/base/AboutView";
import { ExampleView } from "@/components/arena/ExampleView";
import { useAppStore } from "@/lib/providers/appProvider";

export const ArenaApp = () => {
  const showExamples = useAppStore((s) => s.showExamples);

  return (
    <div
      className={
        showExamples
          ? "bg-gradient-to-r w-full h-full rounded-md from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 "
          : ""
      }
    >
      <header className="flex h-16 shrink-0 items-center justify-between gap-2">
        <div className="flex grow items-center gap-2 pl-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="w-full">{showExamples && <ExampleView />}</div>
        </div>
        <div className="pr-4 flex gap-1 items-center">
          <AboutView />
          <a target="_blank" href={"https://github.com/andronov04/aiarena"}>
            <Button variant={"ghost"} className="cursor-pointer">
              <GithubIcon size={18} />
            </Button>
          </a>
          <ThemeModeToggle />
        </div>
      </header>
      <ArenaContent />
    </div>
  );
};
