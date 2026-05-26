import { GoogleAuth } from "google-auth-library";
import type { TrendingRepo } from "./github-trending";

interface VertexPart {
  text?: string;
}

interface VertexResponse {
  candidates?: Array<{
    content?: {
      parts?: VertexPart[];
    };
  }>;
}

const MODEL_ID = "gemini-2.5-flash";

export async function summarizeTrendingRepos(
  repos: TrendingRepo[],
): Promise<Map<string, string>> {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1";

  if (!project) {
    throw new Error("GOOGLE_CLOUD_PROJECT is required for Vertex AI summaries.");
  }

  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;

  if (!accessToken) {
    throw new Error("Could not acquire a Google Cloud access token.");
  }

  const summaries = await Promise.allSettled(
    repos.map(async (repo) => {
      const summary = await summarizeRepo(
        repo,
        endpointFor(location, project),
        accessToken,
      );
      return [`${repo.owner}/${repo.name}`, summary] as const;
    }),
  );

  const summaryMap = new Map<string, string>();

  for (const result of summaries) {
    if (result.status === "fulfilled") {
      summaryMap.set(result.value[0], result.value[1]);
    }
  }

  if (summaryMap.size === 0) {
    const firstError = summaries.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    throw new Error(
      firstError?.reason instanceof Error
        ? firstError.reason.message
        : "Vertex AI summaries failed.",
    );
  }

  return summaryMap;
}

async function summarizeRepo(
  repo: TrendingRepo,
  endpoint: string,
  accessToken: string,
): Promise<string> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(repo) }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 768,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vertex AI request failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as VertexResponse;
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Vertex AI returned an empty summary response.");
  }

  return text.replace(/^["']|["']$/g, "").trim();
}

function endpointFor(location: string, project: string): string {
  const apiHost =
    location === "global"
      ? "aiplatform.googleapis.com"
      : `${location}-aiplatform.googleapis.com`;
  return `https://${apiHost}/v1/projects/${project}/locations/${location}/publishers/google/models/${MODEL_ID}:generateContent`;
}

function buildPrompt(repo: TrendingRepo): string {
  const repoInfo = {
    repo: `${repo.owner}/${repo.name}`,
    description: repo.description,
    language: repo.language,
    stars: repo.stars,
    starsPeriod: repo.starsPeriod,
  };

  return [
    "Write a 'good to know' note for this GitHub Trending repository.",
    "Do not repeat the repository description in different words.",
    "Focus on what is not obvious from a README-style one-line description: likely audience, adoption signal, integration risk, ecosystem fit, or why the trend may matter.",
    "Write 2 compact sentences, 45 to 70 words total.",
    "Use careful inference from the supplied metadata only. Say 'worth checking' for uncertainty instead of claiming unverified facts.",
    "Avoid hype and marketing language. Be concrete and useful for a developer deciding whether to click.",
    "Return plain text only. Do not return JSON, Markdown, bullets, labels, or quotes.",
    "",
    JSON.stringify(repoInfo),
  ].join("\n");
}
