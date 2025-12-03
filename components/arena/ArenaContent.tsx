import { ArenaItem } from "@/components/arena/ArenaItem";
import { useGenerationStore } from "@/lib/providers/generationProvider";

export const ArenaContent = () => {
  const gens = useGenerationStore((s) => s.generations);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-2">
      <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
        {gens.map((item) => (
          <ArenaItem key={item.id} item={item} />
        ))}
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
};
