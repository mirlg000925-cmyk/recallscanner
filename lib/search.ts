import { vehicles } from "./vehicles";
import { Vehicle } from "./types";

// ---------- 정규화 ----------

const MANUFACTURER_ALIASES: Record<string, string> = {
  현대: "현대",
  hyundai: "현대",
  기아: "기아",
  kia: "기아",
  제네시스: "제네시스",
  genesis: "제네시스",
  bmw: "BMW",
  비엠더블유: "BMW",
  테슬라: "테슬라",
  tesla: "테슬라",
};

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\s\-_./]/g, "")
    .trim();
}

// "2022", "22년", "22년식", "'22", "22형" 등에서 연도 추출
export function extractYear(input: string): { year: number | null; rest: string } {
  const patterns = [
    /(19|20)\d{2}(?=\s*년식|\s*년형|\s*년|\s*형|\b)/, // 2022년식, 2022년, 2022
    /'?(\d{2})(?=\s*년식|\s*년형|\s*년|\s*형)/, // 22년식, '22년, 22형
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      let raw = match[0].replace(/[^0-9]/g, "");
      let year: number;
      if (raw.length === 4) {
        year = parseInt(raw, 10);
      } else {
        const twoDigit = parseInt(raw, 10);
        year = twoDigit <= 50 ? 2000 + twoDigit : 1900 + twoDigit;
      }
      const rest = (input.slice(0, match.index) + input.slice((match.index ?? 0) + match[0].length)).trim();
      return { year, rest };
    }
  }
  return { year: null, rest: input };
}

function stripManufacturer(input: string): { manufacturer: string | null; rest: string } {
  const normalized = normalize(input);
  for (const [alias, canonical] of Object.entries(MANUFACTURER_ALIASES)) {
    const normAlias = normalize(alias);
    if (normalized.startsWith(normAlias)) {
      return { manufacturer: canonical, rest: normalized.slice(normAlias.length) };
    }
  }
  return { manufacturer: null, rest: normalized };
}

// ---------- 레벤슈타인 거리 (오타 허용 유사도 검색) ----------

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

// ---------- 차종 인덱스 ----------

interface AliasEntry {
  normalized: string;
  vehicle: Vehicle;
}

function buildAliasIndex(): AliasEntry[] {
  const entries: AliasEntry[] = [];
  for (const v of vehicles) {
    const names = [v.modelName, v.englishName, ...(v.aliases || [])].filter(
      Boolean
    ) as string[];
    for (const name of names) {
      entries.push({ normalized: normalize(name), vehicle: v });
    }
    // 제조사 + 차종 조합도 인덱싱 (예: "현대팰리세이드")
    entries.push({
      normalized: normalize(v.manufacturer + v.modelName),
      vehicle: v,
    });
  }
  return entries;
}

const aliasIndex = buildAliasIndex();

export interface SearchResult {
  exact: Vehicle | null;
  year: number | null;
  candidates: { vehicle: Vehicle; score: number }[];
}

export function searchVehicle(rawInput: string): SearchResult {
  const { year, rest: withoutYear } = extractYear(rawInput);
  const { manufacturer, rest: withoutManufacturer } = stripManufacturer(withoutYear);
  const normalizedQuery = normalize(withoutManufacturer);

  if (!normalizedQuery) {
    return { exact: null, year, candidates: [] };
  }

  // 1) 정확히 일치하는 별칭이 있는지 확인
  let exactMatches = aliasIndex.filter((e) => e.normalized === normalizedQuery);
  if (manufacturer) {
    const withManufacturer = exactMatches.filter((e) => e.vehicle.manufacturer === manufacturer);
    if (withManufacturer.length > 0) exactMatches = withManufacturer;
  }
  if (exactMatches.length === 1) {
    return { exact: exactMatches[0].vehicle, year, candidates: [] };
  }
  if (exactMatches.length > 1) {
    // 같은 차종을 가리키는 여러 별칭이 동시에 일치한 경우 그대로 확정
    const uniqueVehicles = Array.from(new Set(exactMatches.map((e) => e.vehicle)));
    if (uniqueVehicles.length === 1) {
      return { exact: uniqueVehicles[0], year, candidates: [] };
    }
    // 서로 다른 차종에 동시에 매칭되는 경우에만 후보로 제시
    return {
      exact: null,
      year,
      candidates: uniqueVehicles.map((v) => ({ vehicle: v, score: 0 })),
    };
  }

  // 2) 포함 관계 확인 (부분 문자열)
  const containsMatches = aliasIndex.filter(
    (e) =>
      e.normalized.includes(normalizedQuery) || normalizedQuery.includes(e.normalized)
  );
  if (containsMatches.length > 0) {
    const uniqueVehicles = Array.from(new Set(containsMatches.map((e) => e.vehicle)));
    if (uniqueVehicles.length === 1) {
      return { exact: uniqueVehicles[0], year, candidates: [] };
    }
    return {
      exact: null,
      year,
      candidates: uniqueVehicles.map((v) => ({ vehicle: v, score: 1 })),
    };
  }

  // 3) 오타 허용 유사도 검색 (레벤슈타인 거리)
  const scored = aliasIndex
    .map((e) => ({
      vehicle: e.vehicle,
      distance: levenshtein(normalizedQuery, e.normalized),
      length: Math.max(normalizedQuery.length, e.normalized.length),
    }))
    .map((s) => ({ ...s, similarity: 1 - s.distance / (s.length || 1) }))
    .filter((s) => s.similarity >= 0.5)
    .sort((a, b) => b.similarity - a.similarity);

  const seen = new Set<string>();
  const candidates: { vehicle: Vehicle; score: number }[] = [];
  for (const s of scored) {
    if (!seen.has(s.vehicle.id)) {
      seen.add(s.vehicle.id);
      candidates.push({ vehicle: s.vehicle, score: s.similarity });
    }
    if (candidates.length >= 5) break;
  }

  if (candidates.length === 1 && candidates[0].score >= 0.75) {
    return { exact: candidates[0].vehicle, year, candidates: [] };
  }

  return { exact: null, year, candidates };
}

export function getPopularVehicles(): Vehicle[] {
  return vehicles;
}
