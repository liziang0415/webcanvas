import {
  getTrendingUrl,
  normalizeTrendingRange,
  parseTrendingRepos,
} from "../github-trending";

const sampleHtml = `
  <article class="Box-row">
    <h2><a href="/acme-labs/vector-tilekit"> acme-labs / vector-tilekit </a></h2>
    <p>Fast map tile tooling for local-first geospatial apps.</p>
    <span itemprop="programmingLanguage">TypeScript</span>
    <a href="/acme-labs/vector-tilekit/stargazers">12,430</a>
    <span class="float-sm-right">734 stars today</span>
  </article>
  <article class="Box-row">
    <h2><a href="/northstar/db-queue"> northstar / db-queue </a></h2>
    <p>Postgres-backed job queues without a separate broker.</p>
    <a href="/northstar/db-queue/stargazers">8,104</a>
    <span class="float-sm-right">420 stars this week</span>
  </article>
`;

test("normalizeTrendingRange accepts supported ranges", () => {
  expect(normalizeTrendingRange("daily")).toBe("daily");
  expect(normalizeTrendingRange("weekly")).toBe("weekly");
  expect(normalizeTrendingRange("monthly")).toBe("monthly");
});

test("normalizeTrendingRange defaults invalid values to daily", () => {
  expect(normalizeTrendingRange("yearly")).toBe("daily");
  expect(normalizeTrendingRange(null)).toBe("daily");
});

test("getTrendingUrl maps range to GitHub Trending URL", () => {
  expect(getTrendingUrl("weekly")).toBe("https://github.com/trending?since=weekly");
});

test("parseTrendingRepos extracts normalized repo data", () => {
  const repos = parseTrendingRepos(sampleHtml);

  expect(repos).toHaveLength(2);
  expect(repos[0]).toEqual({
    owner: "acme-labs",
    name: "vector-tilekit",
    url: "https://github.com/acme-labs/vector-tilekit",
    description: "Fast map tile tooling for local-first geospatial apps.",
    language: "TypeScript",
    stars: "12,430",
    starsPeriod: "734 stars today",
  });
  expect(repos[1].language).toBeNull();
});

test("parseTrendingRepos respects the limit", () => {
  expect(parseTrendingRepos(sampleHtml, 1)).toHaveLength(1);
});
