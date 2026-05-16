import { GoogleAuth } from "google-auth-library";
import type { TrendingRepo } from "./github-trending";

interface GeminiSummary {
  repo: string;
  summary: string;
}

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

  const apiHost =
    location === "global"
      ? "aiplatform.googleapis.com"
      : `${location}-aiplatform.googleapis.com`;
  const endpoint = `https://${apiHost}/v1/projects/${project}/locations/${location}/publishers/google/models/${MODEL_ID}:generateContent`;
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
          parts: [{ text: buildPrompt(repos) }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 2200,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Vertex AI request failed: ${response.status} ${body}`);
  }

  const payload = (await response.json()) as VertexResponse;
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Vertex AI returned an empty summary response.");
  }

  return summariesToMap(parseSummaryJson(text));
}

function buildPrompt(repos: TrendingRepo[]): string {
  const repoLines = repos.map((repo) => ({
    repo: `${repo.owner}/${repo.name}`,
    description: repo.description,
    language: repo.language,
    stars: repo.stars,
    starsPeriod: repo.starsPeriod,
  }));

  return [
    "Write 'good to know' notes for these GitHub Trending repositories for a technical portfolio section.",
    "Return JSON only, as an array of objects with exactly these keys: repo, summary.",
    "Do not repeat the repository description in different words.",
    "Focus on what is not obvious from a README-style one-line description: likely audience, adoption signal, integration risk, ecosystem fit, or why the trend may matter.",
    "Each summary should be 2 compact sentences, 45 to 70 words total.",
    "Use careful inference from the supplied metadata only. Say 'worth checking' for uncertainty instead of claiming unverified facts.",
    "Avoid hype and marketing language. Be concrete and useful for a developer deciding whether to click.",
    "",
    JSON.stringify(repoLines),
  ].join("\n");
}

function parseSummaryJson(text: string): GeminiSummary[] {
  const parsed = JSON.parse(stripCodeFence(text)) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Vertex AI summary JSON was not an array.");
  }

  return parsed
    .map((item) => {
      if (!isRecord(item)) return null;
      const repo = typeof item.repo === "string" ? item.repo : "";
      const summary = typeof item.summary === "string" ? item.summary : "";
      return repo && summary ? { repo, summary } : null;
    })
    .filter((item): item is GeminiSummary => item !== null);
}

function summariesToMap(summaries: GeminiSummary[]): Map<string, string> {
  return new Map(summaries.map((item) => [item.repo, item.summary]));
}

function stripCodeFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
