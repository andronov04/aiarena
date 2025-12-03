"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/providers/appProvider";
import { shallow } from "zustand/vanilla/shallow";

import { ExternalLinkIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerationStore } from "@/lib/providers/generationProvider";
import { GenerationStatus } from "@/types/generation";

export function ModalEnvManager() {
  const modalState = useAppStore((s) => s.modalState);
  const setModalState = useAppStore((s) => s.setModalState);

  const open = modalState?.key === "modalEnvManager";
  const providerId = modalState?.data.providerId;
  const modelId = modalState?.data.modelId;
  const genId = modalState?.data.genId;

  const { provider, envValues, setEnv, removeEnv } = useAppStore(
    (s) => ({
      provider: s.getProviderById(providerId),
      envValues: s.getEnv(providerId),
      setEnv: s.setEnvForKey,
      removeEnv: s.removeEnvForKey,
    }),
    shallow,
  );
  const { updateGeneration } = useGenerationStore(
    (s) => ({
      updateGeneration: s.updateGeneration,
    }),
    shallow,
  );
  const [localValues, setLocalValues] = useState<Record<string, string>>(
    envValues || {},
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValues(envValues || {});
  }, [open]);

  if (!provider) return null;

  const providerVars = provider.env; // ["MOONSHOT_API_KEY", ...]

  const handleSave = () => {
    providerVars.forEach((key) => {
      const val = localValues[key] || "";
      if (val) {
        setEnv(key, val);
      } else {
        removeEnv(key);
      }
    });
    setModalState(undefined);
    if (genId) {
      updateGeneration(genId, {
        providerId,
        modelId,
        status: GenerationStatus.IDLE,
      });
    }
  };

  const handleClear = () => {
    providerVars.forEach((key) => removeEnv(key));
    setLocalValues(Object.fromEntries(providerVars.map((k) => [k, ""])));
    setModalState(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setModalState(undefined);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            API Keys for {provider.name}
            {provider.doc && (
              <a
                href={provider.doc}
                className="text-muted-foreground"
                target={"_blank"}
              >
                {" "}
                <ExternalLinkIcon className="size-3.5!" />
              </a>
            )}
          </DialogTitle>
          <DialogDescription>
            Enter your API keys below. These keys never leave your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {providerVars.map((key) => (
            <div key={key} className="space-y-1.5">
              <Label>{key}</Label>
              <Input
                type="text"
                className="shadow-none"
                value={localValues[key] || ""}
                placeholder="Enter API key"
                onChange={(e) =>
                  setLocalValues((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            Save
          </Button>
        </DialogFooter>

        <p className="text-xs text-muted-foreground mt-2">
          Your API key is stored locally in your browser and never sent anywhere
          else.
        </p>
      </DialogContent>
    </Dialog>
  );
}
