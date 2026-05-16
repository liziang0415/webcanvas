"use client";

import { useEffect, useState } from "react";

type TrendingRange = "daily" | "weekly" | "monthly";

interface TrendingRepo {
  owner: string;
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: string | null;
  starsPeriod: string | null;
  summary: string;
}

interface TrendingResponse {
  range: TrendingRange;
  repos?: TrendingRepo[];
  error?: string;
  summaryError?: string;
}

const ranges: Array<{ label: string; value: TrendingRange }> = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export function TrendingRepositories() {
  const [range, setRange] = useState<TrendingRange>("daily");
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrendingRepos() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/trending?range=${range}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as TrendingResponse;

        if (!response.ok || payload.error) {
          throw new Error(payload.error ?? "Could not load trending repositories.");
        }

        setRepos(payload.repos ?? []);
        setSummaryError(payload.summaryError ?? null);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setRepos([]);
        setSummaryError(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load trending repositories.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTrendingRepos();

    return () => controller.abort();
  }, [range, reloadKey]);

  return (
    <section id="dev-log" className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-10 border-t border-border pt-12 lg:grid-cols-[0.62fr_1.38fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            GitHub signal
          </p>
          <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Trending repos, translated.
          </h2>
          <p className="mt-5 max-w-[42ch] text-sm leading-7 text-muted">
            The top five GitHub Trending repositories, summarized through Gemini
            2.5 Flash on Vertex AI.
          </p>
        </div>

        <div>
          <div className="mb-5 inline-grid grid-cols-3 border border-border bg-surface/60 p-1">
            {ranges.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRange(item.value)}
                className={`px-4 py-2 font-mono text-xs transition active:translate-y-px ${
                  range === item.value
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}
                aria-pressed={range === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isLoading ? <TrendingSkeleton /> : null}

          {!isLoading && error ? (
            <div className="border border-border bg-surface/55 p-6">
              <h3 className="text-2xl font-semibold tracking-tight">
                Trending feed is unavailable.
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="mt-5 rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:border-signal hover:text-signal active:translate-y-px"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!isLoading && !error && repos.length === 0 ? (
            <div className="border border-border bg-surface/55 p-6">
              <h3 className="text-2xl font-semibold tracking-tight">
                Nothing parsed yet.
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                GitHub returned a page, but no trending repositories were found.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && repos.length > 0 ? (
            <div className="grid gap-4">
              {summaryError ? (
                <p className="border border-border bg-surface/45 px-4 py-3 font-mono text-xs leading-6 text-muted">
                  Gemini note: {summaryError}
                </p>
              ) : null}
              {repos.map((repo, index) => (
                <a
                  key={`${repo.owner}/${repo.name}`}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="reveal-block group block border border-border bg-surface/45 p-5 transition duration-300 hover:border-signal/45 hover:bg-surface active:translate-y-px"
                  style={{ "--index": index } as React.CSSProperties}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-2">
                        {repo.owner}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight group-hover:text-signal">
                        {repo.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 font-mono text-xs text-muted">
                      {repo.language ? <span>{repo.language}</span> : null}
                      {repo.stars ? <span>{repo.stars} stars</span> : null}
                      {repo.starsPeriod ? <span>{repo.starsPeriod}</span> : null}
                    </div>
                  </div>
                  {repo.description ? (
                    <p className="mt-4 max-w-[78ch] text-sm leading-7 text-muted">
                      {repo.description}
                    </p>
                  ) : null}
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-signal">
                      Gemini read
                    </p>
                    <p className="text-sm leading-7 text-foreground/88">
                      {repo.summary}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TrendingSkeleton() {
  return (
    <div className="grid gap-4" aria-label="Loading trending repositories">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="border border-border bg-surface/45 p-5"
        >
          <div className="h-3 w-24 animate-pulse bg-surface-raised" />
          <div className="mt-4 h-7 w-56 animate-pulse bg-surface-raised" />
          <div className="mt-5 h-4 w-full animate-pulse bg-surface-raised" />
          <div className="mt-3 h-4 w-2/3 animate-pulse bg-surface-raised" />
          <div className="mt-6 border-t border-border pt-4">
            <div className="h-3 w-28 animate-pulse bg-surface-raised" />
            <div className="mt-4 h-4 w-5/6 animate-pulse bg-surface-raised" />
          </div>
        </div>
      ))}
    </div>
  );
}
