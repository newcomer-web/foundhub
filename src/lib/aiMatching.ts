import { Item } from './types';
import { calculateDistanceKm } from './utils';

export interface MatchResult {
  item: Item;
  score: number; // 0 to 100
  reasons: string[];
}

export function findSmartMatches(
  target: {
    type: 'FOUND' | 'LOST';
    category: string;
    title: string;
    description: string;
    latitude?: number | null;
    longitude?: number | null;
    eventDate: string;
  },
  allItems: Item[],
  limit = 4
): MatchResult[] {
  // We want to match opposite types: FOUND items match LOST reports, and vice versa
  const counterType = target.type === 'FOUND' ? 'LOST' : 'FOUND';
  const candidates = allItems.filter(
    (item) => item.type === counterType && item.status !== 'RETURNED_TO_OWNER' && item.status !== 'ARCHIVED'
  );

  const results: MatchResult[] = [];

  const targetTokens = extractTokens(`${target.title} ${target.description}`);

  for (const candidate of candidates) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Category match (High weight: 35 points)
    if (candidate.category === target.category) {
      score += 35;
      reasons.push(`Exact category match: ${candidate.category.replace(/_/g, ' ')}`);
    }

    // 2. Keyword / Title overlap (Up to 40 points)
    const candidateTokens = extractTokens(`${candidate.title} ${candidate.description}`);
    const commonTokens = targetTokens.filter((token) => candidateTokens.includes(token));
    if (commonTokens.length > 0) {
      const keywordScore = Math.min(40, commonTokens.length * 10);
      score += keywordScore;
      reasons.push(`Matched keywords: ${commonTokens.slice(0, 4).join(', ')}`);
    }

    // 3. Geographic proximity (Up to 25 points)
    const distKm = calculateDistanceKm(
      target.latitude,
      target.longitude,
      candidate.latitude,
      candidate.longitude
    );
    if (distKm !== null) {
      if (distKm <= 1.0) {
        score += 25;
        reasons.push(`Very close location: ${distKm} km away`);
      } else if (distKm <= 5.0) {
        score += 15;
        reasons.push(`Nearby area: ${distKm} km away`);
      } else if (distKm <= 15.0) {
        score += 5;
        reasons.push(`Same metropolitan radius: ${distKm} km`);
      }
    }

    // 4. Date proximity bonus (Up to 10 points)
    try {
      const targetTime = new Date(target.eventDate).getTime();
      const candidateTime = new Date(candidate.eventDate).getTime();
      const diffDays = Math.abs(targetTime - candidateTime) / (1000 * 60 * 60 * 24);
      if (diffDays <= 3) {
        score += 10;
        reasons.push(`Reported within ${Math.max(1, Math.round(diffDays))} day(s) of each other`);
      }
    } catch {
      // ignore date parse errors
    }

    const finalScore = Math.min(100, score);
    if (finalScore >= 30) {
      results.push({
        item: candidate,
        score: finalScore,
        reasons,
      });
    }
  }

  // Sort descending by match score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

function extractTokens(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'and', 'or',
    'is', 'it', 'was', 'my', 'this', 'that', 'near', 'from', 'floor', 'room',
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}
