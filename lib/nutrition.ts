// USDA Dietary Reference Intakes — daily needs per person by age
// Source: USDA 2020-2025 Dietary Guidelines + DRI tables

export interface NutritionNeeds {
  calories: number;
  protein: number;  // g
  fiber: number;    // g
  sodium: number;   // mg max
}

export function getNeedsForAge(age: number): NutritionNeeds {
  if (age <= 2)  return { calories: 1000, protein: 13, fiber: 19, sodium: 1500 };
  if (age <= 5)  return { calories: 1400, protein: 19, fiber: 25, sodium: 1900 };
  if (age <= 8)  return { calories: 1600, protein: 20, fiber: 25, sodium: 1900 };
  if (age <= 13) return { calories: 1800, protein: 34, fiber: 31, sodium: 2200 };
  if (age <= 18) return { calories: 2000, protein: 50, fiber: 32, sodium: 2300 };
  return             { calories: 2100, protein: 52, fiber: 28, sodium: 2300 };
}

// Adult needs
export const ADULT_NEEDS: NutritionNeeds = { calories: 2100, protein: 52, fiber: 28, sodium: 2300 };

export function totalHouseholdNeeds(adults: number, childAges: number[]): NutritionNeeds {
  let calories = adults * ADULT_NEEDS.calories;
  let protein  = adults * ADULT_NEEDS.protein;
  let fiber    = adults * ADULT_NEEDS.fiber;
  let sodium   = adults * ADULT_NEEDS.sodium;

  for (const age of childAges) {
    const n = getNeedsForAge(age);
    calories += n.calories;
    protein  += n.protein;
    fiber    += n.fiber;
    sodium   += n.sodium;
  }

  return { calories, protein, fiber, sodium };
}
