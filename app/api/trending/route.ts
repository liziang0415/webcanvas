import { NextResponse } from "next/server";
import {
  getTrendingUrl,
  normalizeTrendingRange,
  parseTrendingRepos,
  type TrendingRange,
  type TrendingRepoWithSummary,
} from "@/lib/github-trending";
import { summarizeTrendingRepos } from "@/lib/vertex-gemini";

export const runtime = "nodejs";

const CACHE_TTL_MS = 1000 * 60 * 30;
const cache = new Map<
  TrendingRange,
  { expiresAt: number; repos: TrendingRepoWithSummary[]; summaryError?: string }
>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = normalizeTrendingRange(searchParams.get("range"));
  const cached = cache.get(range);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ range, ...cached });
  }

  try {
    const repos = await fetchTrendingRepos(range);
    let summaryError: string | undefined;
    let summaries = new Map<string, string>();

    try {
      summaries = await summarizeTrendingRepos(repos);
    } catch (error) {
      summaryError =
        error instanceof Error ? error.message : "Gemini summaries failed.";
    }

    const reposWithSummaries = repos.map((repo) => {
      const key = `${repo.owner}/${repo.name}`;
      return {
        ...repo,
        summary:
          summaries.get(key) ??
          "Gemini summary unavailable. Configure Vertex AI credentials to generate this note.",
      };
    });

    const payload = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      repos: reposWithSummaries,
      summaryError,
    };

    cache.set(range, payload);
    return NextResponse.json({ range, ...payload });
  } catch (error) {
    return NextResponse.json(
      {
        range,
        error:
          error instanceof Error
            ? error.message
            : "Could not load GitHub Trending repositories.",
      },
      { status: 502 },
    );
  }
}

async function fetchTrendingRepos(range: TrendingRange) {
  const response = await fetch(getTrendingUrl(range), {
    headers: {
      Accept: "text/html",
      "User-Agent": "ZiangLiPortfolio/1.0",
    },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`GitHub Trending request failed: ${response.status}`);
  }

  const repos = parseTrendingRepos(await response.text(), 5);

  if (repos.length === 0) {
    throw new Error("No repositories were parsed from GitHub Trending.");
  }

  return repos;
}
