import { BookCheck, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DISABLE_EXAMPLES } from "@/lib/constants";
import { useExamples } from "@/hooks/use-examples";
import { useState } from "react";

export const AboutView = () => {
  const { showExamplesHandler, showExamples } = useExamples();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="cursor-pointer">
          <InfoIcon />
          <span className="md:inline hidden">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Airena</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Airena is a client-side AI battleground for comparing{" "}
              <a
                className="underline"
                target="_blank"
                href="https://models.dev"
              >
                1000+ models
              </a>{" "}
              across 68+ providers.
            </p>
            <p>
              Your API keys stay in your browser - no backend, no data logging.
            </p>
            <p>
              Created by{" "}
              <a
                className="underline"
                target="_blank"
                href="https://twitter.com/andronov04"
              >
                @andronov04
              </a>
              . Message me with feedback or bug reports.
            </p>
            {!showExamples && !DISABLE_EXAMPLES && (
              <Button
                onClick={() => {
                  showExamplesHandler();
                  setOpen(false);
                }}
                variant="ghost"
                className="cursor-pointer mt-2"
              >
                <BookCheck />
                Show examples
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
