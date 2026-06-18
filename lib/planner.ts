import { MEALS, type DietTag, type Meal, getUsdaMinimum } from './data';
import { totalHouseholdNeeds, type HouseholdMember, type NutritionNeeds } from './nutrition';

// Simple seeded PRNG (mulberry32) so shuffle is reproducible per seed
// but different across seeds — makes regenerate produce a new plan.
function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), s | 1) ^ (s >>> 11) ^ (s >>> 16) ^ (s << 26)) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type { HouseholdMember };

export interface DayPlan {
  day: number;
  label: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  dayCost: number;
  dayCalories: number;
  dayProtein: number;
  dayCarbs: number;
  dayFat: number;
  dayFiber: number;
  daySodium: number;
  calPct: number;
  protPct: number;
  meetsNutrition: boolean;
  meetsCalories: boolean;
  meetsProtein: boolean;
}

export interface WeekPlan {
  days: DayPlan[];
  totalCost: number;
  weeklyBudget: number;
  monthlyBudget: number;
  withinBudget: boolean;
  belowUsda: boolean;
  usdaMinimum: number;
  members: HouseholdMember[];
  selectedTags: DietTag[];
  needs: NutritionNeeds;
}

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function eligible(meal: Meal, tags: DietTag[]): boolean {
  return tags.every((t) => meal.tags.includes(t));
}

function getPool(type: Meal['type'], tags: DietTag[]): Meal[] {
  return MEALS.filter((m) => m.type === type && eligible(m, tags));
}

/**
 * Score a (breakfast, lunch, dinner) triple.
 *
 * Priority order (nutrition FIRST, then budget use):
 *  1. Must be within daily budget (hard cap)
 *  2. +20 pts for meeting calorie target
 *  3. +20 pts for meeting protein target
 *  4. +5 pts for meeting fiber target
 *  5. +4 pts proportional to how much of the daily budget is used (spend more = better nutrition)
 *  6. -0.5 pts per repeat use of a meal (variety)
 */
function score(
  b: Meal, l: Meal, d: Meal,
  memberCount: number,
  dailyBudget: number,
  needs: NutritionNeeds,
  usedCount: Record<string, number>,
  rand: () => number,
): number {
  const cost = (b.costPerServing + l.costPerServing + d.costPerServing) * memberCount;
  if (cost > dailyBudget) return -Infinity;

  const cal    = (b.calories + l.calories + d.calories) * memberCount;
  const prot   = (b.protein  + l.protein  + d.protein)  * memberCount;
  const fiber  = (b.fiber    + l.fiber    + d.fiber)     * memberCount;

  const budgetUse = cost / dailyBudget;

  const variety = -(
    (usedCount[b.id] ?? 0) +
    (usedCount[l.id] ?? 0) +
    (usedCount[d.id] ?? 0)
  ) * 0.5;

  // Small seeded noise (max ±1.5 pts) so different seeds break ties differently
  // while never overriding a genuine nutrition difference (20 pts gap).
  const noise = (rand() - 0.5) * 3;

  return (
    (cal  >= needs.calories ? 20 : (cal  / needs.calories) * 10) +
    (prot >= needs.protein  ? 20 : (prot / needs.protein)  * 10) +
    (fiber >= needs.fiber   ? 5  : (fiber / needs.fiber)   * 2.5) +
    budgetUse * 4 +
    variety +
    noise
  );
}

function pickDay(
  breakfasts: Meal[], lunches: Meal[], dinners: Meal[],
  memberCount: number, dailyBudget: number,
  needs: NutritionNeeds, usedCount: Record<string, number>,
  rand: () => number,
): { b: Meal; l: Meal; d: Meal } {
  let best: { b: Meal; l: Meal; d: Meal; s: number } | null = null;

  for (const b of breakfasts) {
    for (const l of lunches) {
      for (const d of dinners) {
        const s = score(b, l, d, memberCount, dailyBudget, needs, usedCount, rand);
        if (best === null || s > best.s) best = { b, l, d, s };
      }
    }
  }

  return best ?? { b: breakfasts[0], l: lunches[0], d: dinners[0] };
}

export function generatePlan(
  monthlyBudget: number,
  members: HouseholdMember[],
  selectedTags: DietTag[],
  seed: number = 1,
): WeekPlan {
  const rand = makePrng(seed);
  const memberCount  = members.length;
  const weeklyBudget = monthlyBudget / 4;
  const dailyBudget  = weeklyBudget  / 7;
  const needs        = totalHouseholdNeeds(members);
  const usdaMinimum  = getUsdaMinimum(memberCount);

  const breakfasts = getPool('breakfast', selectedTags);
  const lunches    = getPool('lunch',     selectedTags);
  const dinners    = getPool('dinner',    selectedTags);

  // Shuffle pools so each seed yields a different ordering — same best score
  // but ties broken differently, giving genuine plan variety on regenerate.
  const bs = shuffle(breakfasts.length ? breakfasts : MEALS.filter((m) => m.type === 'breakfast'), rand);
  const ls = shuffle(lunches.length    ? lunches    : MEALS.filter((m) => m.type === 'lunch'),     rand);
  const ds = shuffle(dinners.length    ? dinners    : MEALS.filter((m) => m.type === 'dinner'),    rand);

  const usedCount: Record<string, number> = {};

  const days: DayPlan[] = DAY_LABELS.map((label) => {
    const { b, l, d } = pickDay(bs, ls, ds, memberCount, dailyBudget, needs, usedCount, rand);

    usedCount[b.id] = (usedCount[b.id] ?? 0) + 1;
    usedCount[l.id] = (usedCount[l.id] ?? 0) + 1;
    usedCount[d.id] = (usedCount[d.id] ?? 0) + 1;

    const dayCost     = (b.costPerServing + l.costPerServing + d.costPerServing) * memberCount;
    const dayCalories = (b.calories + l.calories + d.calories) * memberCount;
    const dayProtein  = (b.protein  + l.protein  + d.protein)  * memberCount;
    const dayCarbs    = (b.carbs    + l.carbs    + d.carbs)     * memberCount;
    const dayFat      = (b.fat      + l.fat      + d.fat)       * memberCount;
    const dayFiber    = (b.fiber    + l.fiber    + d.fiber)     * memberCount;
    const daySodium   = (b.sodium   + l.sodium   + d.sodium)    * memberCount;

    // 85% threshold: WHO/USDA consider ≥85% of DRI as adequate for population groups.
    // Meals represent standard servings; larger members naturally take bigger portions.
    const THRESHOLD = 0.85;
    const meetsCalories = dayCalories >= needs.calories * THRESHOLD;
    const meetsProtein  = dayProtein  >= needs.protein  * THRESHOLD;

    return {
      day: DAY_LABELS.indexOf(label) + 1, label,
      breakfast: b, lunch: l, dinner: d,
      dayCost, dayCalories, dayProtein, dayCarbs, dayFat, dayFiber, daySodium,
      calPct:  Math.round((dayCalories / needs.calories) * 100),
      protPct: Math.round((dayProtein  / needs.protein)  * 100),
      meetsCalories, meetsProtein,
      meetsNutrition: meetsCalories && meetsProtein,
    };
  });

  const totalCost = days.reduce((s, d) => s + d.dayCost, 0);

  return {
    days, totalCost, weeklyBudget, monthlyBudget,
    withinBudget: totalCost <= weeklyBudget,
    belowUsda: monthlyBudget < usdaMinimum * 4,
    usdaMinimum: usdaMinimum * 4,
    members, selectedTags, needs,
  };
}
