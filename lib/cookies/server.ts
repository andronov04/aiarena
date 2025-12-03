"use server";
import { cookies } from "next/headers";

export async function getPersist<T = any>(
  key: string,
  fallback?: T,
): Promise<T | undefined> {
  try {
    const store = await cookies();
    const raw = store.get(key)?.value;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`getPersist error for key=${key}`, err);
    return fallback;
  }
}
