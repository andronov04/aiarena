"use client";
import type { Model, Provider } from "@/lib/schemas/models";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import { createXai } from "@ai-sdk/xai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createCohere } from "@ai-sdk/cohere";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { createAzure } from "@ai-sdk/azure";
import { createPerplexity } from "@ai-sdk/perplexity";
import { createDeepInfra } from "@ai-sdk/deepinfra";
import { createVercel } from "@ai-sdk/vercel";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createCerebras } from "@ai-sdk/cerebras";
import { createGateway } from "@ai-sdk/gateway";

import { createOllama } from "ai-sdk-ollama";
import { createWorkersAI } from "workers-ai-provider";
import { createAihubmix } from "@aihubmix/ai-sdk-provider";
import { resolveProviderEnv } from "@/lib/utils";

export const providerConstructors = {
  "@ai-sdk/openai-compatible": createOpenAI,

  "@ai-sdk/openai": createOpenAI,
  "@ai-sdk/groq": createGroq,
  "@ai-sdk/mistral": createMistral,
  "@ai-sdk/xai": createXai,
  "@ai-sdk/anthropic": createAnthropic,
  "@ai-sdk/google": createGoogleGenerativeAI,
  "@ai-sdk/cohere": createCohere,
  "@ai-sdk/perplexity": createPerplexity,
  "@ai-sdk/togetherai": createTogetherAI,
  "@ai-sdk/azure": createAzure,
  "@ai-sdk/gateway": createGateway,
  "@ai-sdk/deepinfra": createDeepInfra,
  "@ai-sdk/vercel": createVercel,
  "@ai-sdk/amazon-bedrock": createAmazonBedrock,
  "@ai-sdk/cerebras": createCerebras,

  "ai-sdk-ollama": createOllama,
  "workers-ai-provider": createWorkersAI,
  "@aihubmix/ai-sdk-provider": createAihubmix,
} as const;

export type SupportedProviderNpm = keyof typeof providerConstructors;

export type ProviderClient = ReturnType<
  (typeof providerConstructors)[SupportedProviderNpm]
>;

export function buildProviderClient(
  provider: Provider,
  envOverride?: Record<string, string | undefined>,
): ProviderClient {
  const envValues = resolveProviderEnv(provider, envOverride);

  const createFn = providerConstructors[provider.npm as SupportedProviderNpm];
  if (!createFn) {
    throw new Error(`Unsupported provider npm: ${provider.npm}`);
  }

  // Default config works for most providers:
  let config: any = {
    apiKey: envValues[provider.env[0]],
    headers: {},
  };

  const allowBaseUrl = [
    "@ai-sdk/openai",
    "@ai-sdk/openai-compatible",
    "ai-sdk-ollama",
  ];

  if (provider.api && allowBaseUrl.includes(provider.npm)) {
    config.baseURL = provider.api;
  }
  if (provider.id === "anthropic") {
    config.headers["anthropic-dangerous-direct-browser-access"] = "true";
  }

  // ===========================
  // SPECIAL PROVIDER HANDLING
  // ===========================

  switch (provider.npm) {
    case "workers-ai-provider": {
      config = {
        apiKey: envValues[provider.env.find((e) => e.includes("API_KEY"))!],
        accountId:
          envValues[provider.env.find((e) => e.includes("ACCOUNT_ID"))!],
      };
      break;
    }

    case "@ai-sdk/azure": {
      config = {
        apiKey: envValues[provider.env.find((e) => e.includes("API_KEY"))!],
        resourceName:
          envValues[provider.env.find((e) => e.includes("RESOURCE_NAME"))!],
      };
      break;
    }

    case "@ai-sdk/google-vertex": {
      config = {
        apiKey: envValues[provider.env.find((e) => e.includes("API_KEY"))!],
        project: envValues[provider.env.find((e) => e.includes("PROJECT"))!],
        location: envValues[provider.env.find((e) => e.includes("LOCATION"))!],
      };
      break;
    }

    default:
      break;
  }

  return createFn(config);
}

export function getModelExecutor(
  provider: Provider,
  model: Model,
  envOverride?: Record<string, string | undefined>,
) {
  const client = buildProviderClient(provider, envOverride);
  return client(model.id as any);
}
