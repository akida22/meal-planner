import { MEALS, type DietTag, type Meal, getUsdaMinimum } from './data';
import { totalHouseholdNeeds, type NutritionNeeds } from './nutrition';

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
  adults: number;
  childAges: number[];
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
 * Goals in priority order:
 *   1. Stay within daily budget
 *   2. Meet household nutrition targets
 *   3. Spend close to (but not over) daily budget (within $0–5 under)
 *   4. Maximise combined nutrition quality
 *   5. Variety — penalise repeated meals
 */
function score(
  b: Meal, l: Meal, d: Meal,
  members: number,
  dailyBudget: number,
  needs: NutritionNeeds,
  usedCount: Record<string, number>,
): number {
  const cost    = (b.costPerServing + l.costPerServing + d.costPerServing) * members;
  if (cost > dailyBudget) return -Infinity;

  const cal     = (b.calories + l.calories + d.calories) * members;
  const protein = (b.protein  + l.protein  + d.protein)  * members;
  const fiber   = (b.fiber    + l.fiber    + d.fiber)     * members;

  const meetsNutrition = cal >= needs.calories && protein >= needs.protein;

  // How much of the daily budget is being used (0–1, reward higher use)
  const budgetUse = cost / dailyBudget;
  // Penalise if more than $5 under daily budget (unused money = worse nutrition potential)
  const budgetGap = Math.max(0, dailyBudget - cost - 5 / 7);

  const calScore  = Math.min(cal     / needs.calories, 1.5);
  const protScore = Math.min(protein / needs.protein,  1.5);
  const fibScore  = Math.min(fiber   / needs.fiber,    1.5);

  const variety = -(
    (usedCount[b.id] ?? 0) +
    (usedCount[l.id] ?? 0) +
    (usedCount[d.id] ?? 0)
  ) * 0.5;

  return (
    (meetsNutrition ? 15 : 0) +
    calScore  * 3 +
    protScore * 3 +
    fibScore  * 1 +
    budgetUse * 4 +
    variety   -
    budgetGap * 0.5
  );
}

function pickDay(
  breakfasts: Meal[],
  lunches: Meal[],
  dinners: Meal[],
  members: number,
  dailyBudget: number,
  needs: NutritionNeeds,
  usedCount: Record<string, number>,
): { b: Meal; l: Meal; d: Meal } {
  let best: { b: Meal; l: Meal; d: Meal; s: number } | null = null;

  for (const b of breakfasts) {
    for (const l of lunches) {
      for (const d of dinners) {
        const s = score(b, l, d, members, dailyBudget, needs, usedCount);
        if (best === null || s > best.s) best = { b, l, d, s };
      }
    }
  }

  return best ?? { b: breakfasts[0], l: lunches[0], d: dinners[0] };
}

export function generatePlan(
  monthlyBudget: number,
  adults: number,
  childAges: number[],
  selectedTags: DietTag[],
): WeekPlan {
  const members      = adults + childAges.length;
  const weeklyBudget = monthlyBudget / 4;
  const dailyBudget  = weeklyBudget  / 7;
  const needs        = totalHouseholdNeeds(adults, childAges);
  const usdaMinimum  = getUsdaMinimum(members);

  const breakfasts = getPool('breakfast', selectedTags);
  const lunches    = getPool('lunch',     selectedTags);
  const dinners    = getPool('dinner',    selectedTags);

  const bs = breakfasts.length ? breakfasts : MEALS.filter((m) => m.type === 'breakfast');
  const ls = lunches.length    ? lunches    : MEALS.filter((m) => m.type === 'lunch');
  const ds = dinners.length    ? dinners    : MEALS.filter((m) => m.type === 'dinner');

  const usedCount: Record<string, number> = {};

  const days: DayPlan[] = DAY_LABELS.map((label, i) => {
    const { b, l, d } = pickDay(bs, ls, ds, members, dailyBudget, needs, usedCount);

    usedCount[b.id] = (usedCount[b.id] ?? 0) + 1;
    usedCount[l.id] = (usedCount[l.id] ?? 0) + 1;
    usedCount[d.id] = (usedCount[d.id] ?? 0) + 1;

    const dayCost     = (b.costPerServing + l.costPerServing + d.costPerServing) * members;
    const dayCalories = (b.calories + l.calories + d.calories) * members;
    const dayProtein  = (b.protein  + l.protein  + d.protein)  * members;
    const dayCarbs    = (b.carbs    + l.carbs    + d.carbs)     * members;
    const dayFat      = (b.fat      + l.fat      + d.fat)       * members;
    const dayFiber    = (b.fiber    + l.fiber    + d.fiber)     * members;
    const daySodium   = (b.sodium   + l.sodium   + d.sodium)    * members;

    return {
      day: i + 1, label,
      breakfast: b, lunch: l, dinner: d,
      dayCost, dayCalories, dayProtein, dayCarbs, dayFat, dayFiber, daySodium,
      meetsNutrition: dayCalories >= needs.calories && dayProtein >= needs.protein,
    };
  });

  const totalCost = days.reduce((s, d) => s + d.dayCost, 0);

  return {
    days, totalCost,
    weeklyBudget, monthlyBudget,
    withinBudget: totalCost <= weeklyBudget,
    belowUsda: monthlyBudget < usdaMinimum * 4,
    usdaMinimum: usdaMinimum * 4,
    adults, childAges, selectedTags, needs,
  };
}
