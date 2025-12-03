import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { Provider, Model } from "@/lib/schemas/models";
import { SORT_MODELS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const generateUUID = () => uuidv4();

export function resolveProviderEnv(
  provider: Provider,
  envSrc: Record<string, string | undefined> = process.env,
): Record<string, string> {
  const resolved: Record<string, string> = {};

  provider.env.forEach((key) => {
    const val = envSrc[key];
    if (!val) throw new Error(`Missing env variable: ${key}`);
    resolved[key] = val;
  });

  return resolved;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function stripMarkdownFences(str: string): string {
  let cleaned = str.trim();

  if (cleaned.startsWith("```html")) {
    cleaned = cleaned.slice("```html".length).trimStart();
  } else if (cleaned.startsWith("```HTML")) {
    cleaned = cleaned.slice("```HTML".length).trimStart();
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3).trimStart();
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3).trimEnd();
  }

  return cleaned;
}

/**
 * Sort models so that:
 * 1) Models listed in SORT_MODELS go first (in that order)
 * 2) All other models sorted by release_date DESC (newest first)
 */
export function sortModels(models: Model[]): Model[] {
  return [...models].sort((a, b) => {
    const aIndex = SORT_MODELS.indexOf(a.id);
    const bIndex = SORT_MODELS.indexOf(b.id);

    const aPriority = aIndex !== -1;
    const bPriority = bIndex !== -1;

    if (aPriority && bPriority) return aIndex - bIndex;

    if (aPriority) return -1;

    if (bPriority) return 1;

    const aDate = a.release_date ?? "0";
    const bDate = b.release_date ?? "0";

    return bDate.localeCompare(aDate);
  });
}
