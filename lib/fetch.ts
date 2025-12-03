"use server";
import { headers } from "next/headers";

export async function fetchData<T>(path: string, ttl = 3600): Promise<T> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const url = `${protocol}://${host}/${path}`;

  const response = await fetch(url, {
    next: {
      revalidate: ttl,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch models.json: ${response.statusText}`);
  }

  return response.json();
}
