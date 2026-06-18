/**
 * Nutritional targets based on:
 * - USDA Dietary Reference Intakes (DRI) 2020
 * - WHO Global Nutrition Targets
 * - Institute of Medicine Macronutrient Report
 *
 * Values represent daily minimums for adequate nutrition.
 * Gender-specific from age 9 onwards (per DRI tables).
 */

export type Gender = 'male' | 'female';

export interface NutritionNeeds {
  calories: number;  // kcal/day
  protein: number;   // g/day (0.8–1.0 g/kg body weight, WHO)
  fiber: number;     // g/day (Institute of Medicine)
  sodium: number;    // mg/day max (WHO: <2000mg ideal)
}

// DRI table: [calories, protein(g), fiber(g), sodium_max(mg)]
function lookup(age: number, gender: Gender): NutritionNeeds {
  // Infants & toddlers (0–3) — no gender difference
  if (age <= 1)  return { calories: 1000, protein: 11,  fiber: 19, sodium: 1500 };
  if (age <= 3)  return { calories: 1200, protein: 13,  fiber: 19, sodium: 1500 };

  // Children 4–8 — small gender difference starts
  if (age <= 8) {
    return gender === 'female'
      ? { calories: 1400, protein: 19, fiber: 25, sodium: 1900 }
      : { calories: 1600, protein: 19, fiber: 25, sodium: 1900 };
  }

  // Children 9–13 — diverges more by gender
  if (age <= 13) {
    return gender === 'female'
      ? { calories: 1800, protein: 34, fiber: 26, sodium: 2200 }
      : { calories: 2000, protein: 34, fiber: 31, sodium: 2200 };
  }

  // Teens 14–18
  if (age <= 18) {
    return gender === 'female'
      ? { calories: 2000, protein: 46, fiber: 26, sodium: 2300 }
      : { calories: 2400, protein: 52, fiber: 38, sodium: 2300 };
  }

  // Adults 19+ (sedentary to moderately active, per WHO)
  return gender === 'female'
    ? { calories: 2000, protein: 50, fiber: 25, sodium: 2300 }
    : { calories: 2500, protein: 60, fiber: 38, sodium: 2300 };
}

export function getNeedsForAge(age: number, gender: Gender): NutritionNeeds {
  return lookup(age, gender);
}

export interface HouseholdMember {
  gender: Gender;
  age: number;        // adults: 30 (representative)
  isAdult: boolean;
}

export function totalHouseholdNeeds(members: HouseholdMember[]): NutritionNeeds {
  return members.reduce(
    (acc, m) => {
      const n = lookup(m.age, m.gender);
      return {
        calories: acc.calories + n.calories,
        protein:  acc.protein  + n.protein,
        fiber:    acc.fiber    + n.fiber,
        sodium:   acc.sodium   + n.sodium,
      };
    },
    { calories: 0, protein: 0, fiber: 0, sodium: 0 }
  );
}
