import { MEALS, type DietTag, type Meal, getUsdaMinimum, DAILY_PER_PERSON } from './data';

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
  meetsNutrition: boolean;
}

export interface WeekPlan {
  days: DayPlan[];
  totalCost: number;
  weeklyBudget: number;
  monthlyBudget: number;
  withinBudget: boolean;
  belowUsda: boolean;
  usdaMinimum: number;
  householdSize: number;
  selectedTags: DietTag[];
}

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function eligible(meal: Meal, tags: DietTag[]): boolean {
  return tags.every((t) => meal.tags.includes(t));
}

function getPool(type: Meal['type'], tags: DietTag[]): Meal[] {
  return MEALS.filter((m) => m.type === type && eligible(m, tags));
}

/**
 * Score a meal triple on how well it uses the daily budget and meets nutrition.
 * Higher = better. Prioritises:
 *   1. Meeting calorie + protein targets
 *   2. Spending closer to (but not over) the daily budget
 *   3. Higher combined nutrition score (cal + protein + fiber)
 *   4. Variety (penalise over-used meals)
 */
function score(
  b: Meal, l: Meal, d: Meal,
  householdSize: number,
  dailyBudget: number,
  usedCount: Record<string, number>,
): number {
  const cost    = (b.costPerServing + l.costPerServing + d.costPerServing) * householdSize;
  const cal     = b.calories + l.calories + d.calories;
  const protein = b.protein  + l.protein  + d.protein;
  const fiber   = b.fiber    + l.fiber    + d.fiber;

  if (cost > dailyBudget) return -Infinity; // over budget — disqualified

  const meetsNutrition = cal >= DAILY_PER_PERSON.calories && protein >= DAILY_PER_PERSON.protein;

  // Nutrition score: how close to hitting daily targets (capped at 1.0 each)
  const calScore  = Math.min(cal     / DAILY_PER_PERSON.calories, 1.5);
  const protScore = Math.min(protein / DAILY_PER_PERSON.protein,  1.5);
  const fiberScore= Math.min(fiber   / DAILY_PER_PERSON.fiber,    1.5);

  // Budget utilisation: reward spending more of the daily budget (up to 100%)
  const budgetUse = cost / dailyBudget;

  // Variety penalty: penalise meals used more than once already
  const variety = -(
    (usedCount[b.id] ?? 0) +
    (usedCount[l.id] ?? 0) +
    (usedCount[d.id] ?? 0)
  ) * 0.5;

  return (
    (meetsNutrition ? 10 : 0) +   // big bonus for hitting targets
    calScore   * 3 +
    protScore  * 3 +
    fiberScore * 1 +
    budgetUse  * 2 +               // reward using more of the budget
    variety
  );
}

function pickDay(
  breakfasts: Meal[],
  lunches: Meal[],
  dinners: Meal[],
  usedCount: Record<string, number>,
  householdSize: number,
  dailyBudget: number,
): { b: Meal; l: Meal; d: Meal } {
  let best: { b: Meal; l: Meal; d: Meal; s: number } | null = null;

  for (const b of breakfasts) {
    for (const l of lunches) {
      for (const d of dinners) {
        const s = score(b, l, d, householdSize, dailyBudget, usedCount);
        if (best === null || s > best.s) best = { b, l, d, s };
      }
    }
  }

  // Fallback (should never happen): just pick first of each
  return best ?? { b: breakfasts[0], l: lunches[0], d: dinners[0] };
}

export function generatePlan(
  monthlyBudget: number,
  householdSize: number,
  selectedTags: DietTag[],
): WeekPlan {
  const weeklyBudget = monthlyBudget / 4;
  const dailyBudget  = weeklyBudget / 7;

  const breakfasts = getPool('breakfast', selectedTags);
  const lunches    = getPool('lunch',     selectedTags);
  const dinners    = getPool('dinner',    selectedTags);

  const bs = breakfasts.length ? breakfasts : MEALS.filter((m) => m.type === 'breakfast');
  const ls = lunches.length    ? lunches    : MEALS.filter((m) => m.type === 'lunch');
  const ds = dinners.length    ? dinners    : MEALS.filter((m) => m.type === 'dinner');

  const usdaMinimum = getUsdaMinimum(householdSize);
  const usedCount: Record<string, number> = {};

  const days: DayPlan[] = DAY_LABELS.map((label, i) => {
    const { b, l, d } = pickDay(bs, ls, ds, usedCount, householdSize, dailyBudget);

    usedCount[b.id] = (usedCount[b.id] ?? 0) + 1;
    usedCount[l.id] = (usedCount[l.id] ?? 0) + 1;
    usedCount[d.id] = (usedCount[d.id] ?? 0) + 1;

    const dayCost     = (b.costPerServing + l.costPerServing + d.costPerServing) * householdSize;
    const dayCalories = b.calories + l.calories + d.calories;
    const dayProtein  = b.protein  + l.protein  + d.protein;
    const dayCarbs    = b.carbs    + l.carbs    + d.carbs;
    const dayFat      = b.fat      + l.fat      + d.fat;
    const dayFiber    = b.fiber    + l.fiber    + d.fiber;
    const daySodium   = b.sodium   + l.sodium   + d.sodium;

    return {
      day: i + 1,
      label,
      breakfast: b, lunch: l, dinner: d,
      dayCost, dayCalories, dayProtein, dayCarbs, dayFat, dayFiber, daySodium,
      meetsNutrition: dayCalories >= DAILY_PER_PERSON.calories && dayProtein >= DAILY_PER_PERSON.protein,
    };
  });

  const totalCost = days.reduce((sum, d) => sum + d.dayCost, 0);

  return {
    days,
    totalCost,
    weeklyBudget,
    monthlyBudget,
    withinBudget: totalCost <= weeklyBudget,
    belowUsda: monthlyBudget < usdaMinimum * 4,
    usdaMinimum: usdaMinimum * 4,
    householdSize,
    selectedTags,
  };
}
