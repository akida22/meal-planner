export type DietTag = 'vegetarian' | 'vegan' | 'halal' | 'gluten-free' | 'dairy-free';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  tags: DietTag[];
  ingredients: Ingredient[];
  // All values are per person per meal (USDA-based estimates)
  calories: number;
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  fiber: number;    // g
  sodium: number;   // mg
  costPerServing: number; // USD
}

// USDA Thrifty Plan weekly minimums (2024) by household size
export const USDA_WEEKLY_MINIMUMS: Record<number, number> = {
  1: 47, 2: 87, 3: 122, 4: 155, 5: 183, 6: 213, 7: 242, 8: 271,
};

export function getUsdaMinimum(householdSize: number): number {
  if (householdSize <= 0) return USDA_WEEKLY_MINIMUMS[1];
  if (householdSize > 8) return USDA_WEEKLY_MINIMUMS[8] + (householdSize - 8) * 30;
  return USDA_WEEKLY_MINIMUMS[householdSize];
}

// Daily nutrition targets per person (USDA 2020-2025 Dietary Guidelines)
export const DAILY_PER_PERSON = {
  calories: 2000,
  protein: 50,   // g  (10–35% of calories)
  fiber: 28,     // g
  sodium: 2300,  // mg
};

export const MEALS: Meal[] = [
  // ── BREAKFASTS ───────────────────────────────────────────────────────────────

  {
    id: 'b1',
    name: 'Oatmeal with Banana & Honey',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Rolled oats (GF certified)', amount: '½ cup dry' },
      { name: 'Banana', amount: '1 medium' },
      { name: 'Honey', amount: '1 tbsp' },
      { name: 'Cinnamon', amount: 'pinch' },
      { name: 'Water or oat milk', amount: '1 cup' },
    ],
    // Oats 150 cal / Banana 105 / Honey 64 / oat milk ~45
    calories: 364, protein: 8, carbs: 74, fat: 4, fiber: 7, sodium: 15,
    costPerServing: 0.85,
  },
  {
    id: 'b2',
    name: 'Scrambled Eggs & Whole Wheat Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    ingredients: [
      { name: 'Eggs', amount: '2 large' },
      { name: 'Whole wheat bread', amount: '2 slices' },
      { name: 'Butter', amount: '1 tsp' },
      { name: 'Salt & pepper', amount: 'to taste' },
    ],
    // 2 eggs 140, 2 slices WW bread 160, butter 34
    calories: 334, protein: 20, carbs: 29, fat: 16, fiber: 4, sodium: 420,
    costPerServing: 1.10,
  },
  {
    id: 'b3',
    name: 'Greek Yogurt with Berries & Granola',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free'],
    ingredients: [
      { name: 'Plain Greek yogurt (whole milk)', amount: '1 cup' },
      { name: 'Mixed berries (fresh or frozen)', amount: '½ cup' },
      { name: 'GF granola', amount: '2 tbsp' },
      { name: 'Honey', amount: '1 tsp' },
    ],
    // Yogurt 150, berries 40, granola 70, honey 21
    calories: 281, protein: 14, carbs: 36, fat: 9, fiber: 3, sodium: 60,
    costPerServing: 1.40,
  },
  {
    id: 'b4',
    name: 'Avocado Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    ingredients: [
      { name: 'Whole wheat bread', amount: '2 slices' },
      { name: 'Avocado', amount: '½ medium' },
      { name: 'Lemon juice', amount: '1 tsp' },
      { name: 'Red pepper flakes & salt', amount: 'pinch each' },
    ],
    // Bread 160, avocado ½ 120
    calories: 295, protein: 8, carbs: 32, fat: 16, fiber: 8, sodium: 310,
    costPerServing: 1.60,
  },
  {
    id: 'b5',
    name: 'Berry Smoothie Bowl',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Frozen banana', amount: '1 medium' },
      { name: 'Frozen mixed berries', amount: '½ cup' },
      { name: 'Oat milk', amount: '¼ cup' },
      { name: 'Chia seeds', amount: '1 tbsp' },
      { name: 'Hemp seeds (topping)', amount: '1 tbsp' },
    ],
    // Banana 105, berries 40, oat milk 15, chia 60, hemp 57
    calories: 277, protein: 9, carbs: 44, fat: 9, fiber: 10, sodium: 30,
    costPerServing: 1.25,
  },
  {
    id: 'b6',
    name: 'Fluffy Pancakes with Maple Syrup',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    ingredients: [
      { name: 'All-purpose flour', amount: '½ cup' },
      { name: 'Egg', amount: '1 large' },
      { name: 'Milk', amount: '½ cup' },
      { name: 'Baking powder', amount: '1 tsp' },
      { name: 'Maple syrup', amount: '2 tbsp' },
    ],
    // Pancakes ~200 cal, syrup 104
    calories: 390, protein: 10, carbs: 68, fat: 8, fiber: 2, sodium: 380,
    costPerServing: 0.95,
  },
  {
    id: 'b7',
    name: 'Ginger Rice Porridge (Congee)',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'White rice', amount: '¼ cup dry' },
      { name: 'Low-sodium vegetable broth', amount: '2 cups' },
      { name: 'Fresh ginger', amount: '1 tsp grated' },
      { name: 'Green onion', amount: '1 stalk' },
      { name: 'Sesame oil (finish)', amount: '½ tsp' },
    ],
    // Rice 170, broth 15, sesame oil 20
    calories: 215, protein: 4, carbs: 42, fat: 3, fiber: 1, sodium: 320,
    costPerServing: 0.55,
  },
  {
    id: 'b8',
    name: 'Peanut Butter Banana Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    ingredients: [
      { name: 'Whole wheat bread', amount: '2 slices' },
      { name: 'Natural peanut butter', amount: '2 tbsp' },
      { name: 'Banana', amount: '½ medium' },
      { name: 'Honey', amount: '1 tsp' },
    ],
    // Bread 160, PB 190, banana ½ 52, honey 21
    calories: 423, protein: 14, carbs: 52, fat: 17, fiber: 6, sodium: 290,
    costPerServing: 0.90,
  },
  {
    id: 'b9',
    name: 'Boiled Eggs & Seasonal Fruit Plate',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Eggs', amount: '2 large' },
      { name: 'Seasonal fruit (apple, orange, or grapes)', amount: '1 cup' },
      { name: 'Olive oil drizzle', amount: '1 tsp' },
      { name: 'Salt & pepper', amount: 'to taste' },
    ],
    // Eggs 140, fruit 80, olive oil 40
    calories: 260, protein: 13, carbs: 20, fat: 14, fiber: 3, sodium: 130,
    costPerServing: 1.00,
  },

  // ── LUNCHES ──────────────────────────────────────────────────────────────────

  {
    id: 'l1',
    name: 'Red Lentil Soup',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Red lentils', amount: '½ cup dry' },
      { name: 'Canned diced tomatoes', amount: '⅓ cup' },
      { name: 'Onion', amount: '¼ medium' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Cumin, turmeric, paprika', amount: '½ tsp each' },
      { name: 'Low-sodium vegetable broth', amount: '1½ cups' },
    ],
    // Lentils cooked 230, tomatoes 20, broth 15
    calories: 298, protein: 18, carbs: 50, fat: 2, fiber: 16, sodium: 340,
    costPerServing: 0.90,
  },
  {
    id: 'l2',
    name: 'Halal Chicken & Brown Rice Bowl',
    type: 'lunch',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Halal boneless chicken thigh', amount: '4 oz' },
      { name: 'Brown rice', amount: '½ cup dry' },
      { name: 'Broccoli', amount: '1 cup' },
      { name: 'Tamari (GF soy sauce)', amount: '1 tbsp' },
      { name: 'Olive oil', amount: '1 tsp' },
      { name: 'Garlic powder', amount: '½ tsp' },
    ],
    // Chicken 209, brown rice 215, broccoli 30, oil 40
    calories: 498, protein: 34, carbs: 54, fat: 12, fiber: 5, sodium: 590,
    costPerServing: 2.20,
  },
  {
    id: 'l3',
    name: 'Black Bean Corn Tacos',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Corn tortillas (6-inch)', amount: '3' },
      { name: 'Canned black beans (drained)', amount: '½ cup' },
      { name: 'Corn kernels', amount: '¼ cup' },
      { name: 'Shredded cabbage', amount: '½ cup' },
      { name: 'Fresh salsa', amount: '2 tbsp' },
      { name: 'Lime', amount: '¼' },
    ],
    // Tortillas 3×50=150, beans 110, corn 35, cabbage 11
    calories: 340, protein: 13, carbs: 66, fat: 4, fiber: 12, sodium: 310,
    costPerServing: 1.30,
  },
  {
    id: 'l4',
    name: 'Tuna Salad Sandwich',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    ingredients: [
      { name: 'Canned light tuna in water', amount: '3 oz drained' },
      { name: 'Whole wheat bread', amount: '2 slices' },
      { name: 'Vegan mayo', amount: '1 tbsp' },
      { name: 'Celery', amount: '1 stalk' },
      { name: 'Lettuce & tomato', amount: '2 leaves + 2 slices' },
    ],
    // Tuna 70, bread 160, mayo 50, celery 6, veggies 20
    calories: 346, protein: 27, carbs: 31, fat: 12, fiber: 5, sodium: 560,
    costPerServing: 1.80,
  },
  {
    id: 'l5',
    name: 'Chickpea & Spinach Stew',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Canned chickpeas (drained)', amount: '½ cup' },
      { name: 'Fresh spinach', amount: '2 cups' },
      { name: 'Canned diced tomatoes', amount: '¼ cup' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Olive oil', amount: '1 tsp' },
      { name: 'Cumin & smoked paprika', amount: '½ tsp each' },
    ],
    // Chickpeas 135, spinach 14, tomatoes 10, oil 40
    calories: 230, protein: 10, carbs: 32, fat: 7, fiber: 9, sodium: 320,
    costPerServing: 1.10,
  },
  {
    id: 'l6',
    name: 'Pasta with Marinara Sauce',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    ingredients: [
      { name: 'Whole wheat pasta', amount: '2 oz dry' },
      { name: 'Marinara sauce', amount: '½ cup' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Olive oil', amount: '1 tsp' },
      { name: 'Fresh basil', amount: 'handful' },
    ],
    // WW pasta 180, marinara 70, oil 40
    calories: 322, protein: 11, carbs: 58, fat: 7, fiber: 7, sodium: 480,
    costPerServing: 1.00,
  },
  {
    id: 'l7',
    name: 'Vegetable Egg Fried Rice',
    type: 'lunch',
    tags: ['vegetarian', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Cooked white rice (day-old)', amount: '1 cup' },
      { name: 'Eggs', amount: '2 large' },
      { name: 'Frozen peas & carrots', amount: '½ cup' },
      { name: 'Sesame oil', amount: '1 tsp' },
      { name: 'Tamari (GF soy sauce)', amount: '1 tbsp' },
      { name: 'Green onion', amount: '1 stalk' },
    ],
    // Rice 206, eggs 140, veggies 45, oil 40
    calories: 451, protein: 17, carbs: 60, fat: 14, fiber: 3, sodium: 640,
    costPerServing: 1.20,
  },
  {
    id: 'l8',
    name: 'Peanut Noodle Bowl',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    ingredients: [
      { name: 'Rice noodles', amount: '2 oz dry' },
      { name: 'Natural peanut butter', amount: '2 tbsp' },
      { name: 'Soy sauce', amount: '1 tbsp' },
      { name: 'Rice vinegar', amount: '1 tsp' },
      { name: 'Shredded carrots & cucumber', amount: '½ cup each' },
      { name: 'Lime juice', amount: '1 tsp' },
    ],
    // Noodles 190, PB 190, veggies 30
    calories: 436, protein: 13, carbs: 62, fat: 15, fiber: 4, sodium: 680,
    costPerServing: 1.40,
  },
  {
    id: 'l9',
    name: 'Halal Beef & Veggie Wrap',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    ingredients: [
      { name: 'Halal ground beef (lean)', amount: '3 oz' },
      { name: 'Large flour tortilla', amount: '1 (10-inch)' },
      { name: 'Lettuce, tomato, onion', amount: '½ cup mixed' },
      { name: 'Hot sauce', amount: '1 tsp' },
      { name: 'Olive oil (cooking)', amount: '½ tsp' },
    ],
    // Beef 186, tortilla 220, veggies 20
    calories: 447, protein: 26, carbs: 43, fat: 17, fiber: 3, sodium: 540,
    costPerServing: 2.10,
  },

  // ── DINNERS ──────────────────────────────────────────────────────────────────

  {
    id: 'd1',
    name: 'Baked Chicken Thighs & Roasted Vegetables',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Halal bone-in chicken thighs (skin-on)', amount: '5 oz raw' },
      { name: 'Sweet potato', amount: '1 medium (150g)' },
      { name: 'Broccoli florets', amount: '1 cup' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Garlic powder, smoked paprika, oregano', amount: '1 tsp each' },
    ],
    // Chicken thigh baked 250, sweet potato 130, broccoli 30, oil 120
    calories: 495, protein: 36, carbs: 38, fat: 20, fiber: 7, sodium: 390,
    costPerServing: 2.60,
  },
  {
    id: 'd2',
    name: 'Tofu & Vegetable Stir-Fry with Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Extra-firm tofu', amount: '4 oz' },
      { name: 'Bell pepper', amount: '½ large' },
      { name: 'Snap peas', amount: '½ cup' },
      { name: 'Carrots', amount: '½ cup sliced' },
      { name: 'Tamari (GF)', amount: '2 tbsp' },
      { name: 'Sesame oil', amount: '1 tsp' },
      { name: 'White rice', amount: '½ cup dry' },
    ],
    // Tofu 94, veggies 60, tamari 10, oil 40, rice 206
    calories: 438, protein: 22, carbs: 62, fat: 11, fiber: 5, sodium: 780,
    costPerServing: 1.80,
  },
  {
    id: 'd3',
    name: 'Halal Ground Beef Tacos',
    type: 'dinner',
    tags: ['halal', 'gluten-free'],
    ingredients: [
      { name: 'Halal lean ground beef', amount: '4 oz raw' },
      { name: 'Corn tortillas (6-inch)', amount: '3' },
      { name: 'Shredded Mexican cheese blend', amount: '2 tbsp' },
      { name: 'Shredded lettuce & diced tomato', amount: '½ cup' },
      { name: 'Taco seasoning (salt-reduced)', amount: '1 tsp' },
    ],
    // Beef cooked 248, tortillas 150, cheese 42, veggies 15
    calories: 497, protein: 33, carbs: 40, fat: 22, fiber: 5, sodium: 620,
    costPerServing: 2.80,
  },
  {
    id: 'd4',
    name: 'Red Lentil Dal with Basmati Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Red lentils', amount: '½ cup dry' },
      { name: 'Basmati rice', amount: '½ cup dry' },
      { name: 'Onion, garlic, fresh ginger', amount: '¼ medium each' },
      { name: 'Light coconut milk', amount: '¼ cup' },
      { name: 'Garam masala, turmeric, cumin', amount: '1 tsp each' },
      { name: 'Canned diced tomatoes', amount: '¼ cup' },
    ],
    // Lentils 230, rice 206, coconut milk 45
    calories: 530, protein: 22, carbs: 90, fat: 8, fiber: 14, sodium: 190,
    costPerServing: 1.40,
  },
  {
    id: 'd5',
    name: 'Halal Spaghetti Bolognese',
    type: 'dinner',
    tags: ['halal'],
    ingredients: [
      { name: 'Whole wheat spaghetti', amount: '2 oz dry' },
      { name: 'Halal lean ground beef', amount: '3 oz raw' },
      { name: 'Marinara sauce', amount: '½ cup' },
      { name: 'Onion & garlic', amount: '¼ onion, 2 cloves' },
      { name: 'Olive oil', amount: '1 tsp' },
      { name: 'Parmesan cheese', amount: '2 tbsp' },
    ],
    // Pasta 180, beef 186, marinara 70, cheese 44
    calories: 515, protein: 30, carbs: 54, fat: 18, fiber: 6, sodium: 590,
    costPerServing: 2.40,
  },
  {
    id: 'd6',
    name: 'Black Bean Burrito Bowl',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'White rice', amount: '½ cup dry' },
      { name: 'Canned black beans (drained)', amount: '½ cup' },
      { name: 'Frozen corn', amount: '¼ cup' },
      { name: 'Fresh salsa', amount: '3 tbsp' },
      { name: 'Avocado', amount: '¼ medium' },
      { name: 'Lime juice', amount: '1 tbsp' },
      { name: 'Cilantro', amount: 'handful' },
    ],
    // Rice 206, beans 110, corn 35, avocado 60
    calories: 455, protein: 14, carbs: 80, fat: 9, fiber: 12, sodium: 280,
    costPerServing: 1.70,
  },
  {
    id: 'd7',
    name: 'Baked Salmon with Quinoa & Asparagus',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Atlantic salmon fillet', amount: '4 oz' },
      { name: 'Quinoa', amount: '½ cup dry' },
      { name: 'Asparagus', amount: '6 spears' },
      { name: 'Lemon', amount: '¼' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Garlic & dill', amount: '1 clove, ½ tsp' },
    ],
    // Salmon 177, quinoa 222, asparagus 20, oil 120
    calories: 539, protein: 38, carbs: 40, fat: 22, fiber: 6, sodium: 300,
    costPerServing: 3.50,
  },
  {
    id: 'd8',
    name: 'Lentil & Mushroom Shepherd\'s Pie',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Brown mushrooms', amount: '1 cup' },
      { name: 'Green or brown lentils', amount: '⅓ cup dry' },
      { name: 'Russet potato (mashed topping)', amount: '1 medium' },
      { name: 'Onion, carrot, celery', amount: '¼ cup each' },
      { name: 'Low-sodium vegetable broth', amount: '½ cup' },
      { name: 'Thyme & rosemary', amount: '½ tsp each' },
    ],
    // Lentils 172, potato 160, mushrooms 15, veggies 50
    calories: 430, protein: 18, carbs: 75, fat: 4, fiber: 14, sodium: 310,
    costPerServing: 1.90,
  },
  {
    id: 'd9',
    name: 'Chickpea Coconut Curry with Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Canned chickpeas (drained)', amount: '½ cup' },
      { name: 'Light coconut milk', amount: '¼ cup' },
      { name: 'Canned diced tomatoes', amount: '¼ cup' },
      { name: 'Curry powder, cumin, coriander', amount: '1 tsp each' },
      { name: 'Onion & garlic', amount: '¼ onion, 2 cloves' },
      { name: 'White rice', amount: '½ cup dry' },
    ],
    // Chickpeas 135, coconut milk 45, rice 206, tomatoes 20
    calories: 458, protein: 14, carbs: 79, fat: 10, fiber: 10, sodium: 290,
    costPerServing: 1.60,
  },
  {
    id: 'd10',
    name: 'Garlic Shrimp & Vegetable Rice',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    ingredients: [
      { name: 'Shrimp (peeled, deveined)', amount: '4 oz' },
      { name: 'White rice', amount: '½ cup dry' },
      { name: 'Zucchini', amount: '½ medium' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Lemon & parsley', amount: '¼ lemon, handful' },
    ],
    // Shrimp 112, rice 206, zucchini 17, oil 120
    calories: 430, protein: 29, carbs: 50, fat: 13, fiber: 2, sodium: 440,
    costPerServing: 2.80,
  },
];
