import * as cheerio from "cheerio";

export const TRENDING_RANGES = ["daily", "weekly", "monthly"] as const;

export type TrendingRange = (typeof TRENDING_RANGES)[number];

export interface TrendingRepo {
  owner: string;
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: string | null;
  starsPeriod: string | null;
}

export interface TrendingRepoWithSummary extends TrendingRepo {
  summary: string;
}

export function normalizeTrendingRange(value: string | null): TrendingRange {
  return TRENDING_RANGES.includes(value as TrendingRange)
    ? (value as TrendingRange)
    : "daily";
}

export function getTrendingUrl(range: TrendingRange): string {
  return `https://github.com/trending?since=${range}`;
}

export function parseTrendingRepos(html: string, limit = 5): TrendingRepo[] {
  const $ = cheerio.load(html);

  return $("article.Box-row")
    .toArray()
    .slice(0, limit)
    .map((article) => {
      const $article = $(article);
      const repoLink = $article.find("h2 a").first();
      const href = repoLink.attr("href")?.trim() ?? "";
      const [owner = "", name = ""] = href
        .replace(/^\//, "")
        .split("/")
        .map((part) => cleanText(part));

      const stargazersPath = `/${owner}/${name}/stargazers`;
      const stars =
        cleanText(
          $article
            .find(`a[href="${stargazersPath}"]`)
            .first()
            .text(),
        ) || null;

      const starsPeriod =
        cleanText($article.find("span.float-sm-right").last().text()) || null;

      return {
        owner,
        name,
        url: href ? `https://github.com${href}` : "https://github.com",
        description: cleanText($article.find("p").first().text()),
        language:
          cleanText($article.find('[itemprop="programmingLanguage"]').first().text()) ||
          null,
        stars,
        starsPeriod,
      };
    })
    .filter((repo) => repo.owner && repo.name);
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
