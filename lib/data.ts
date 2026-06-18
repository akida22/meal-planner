export type DietTag = 'vegetarian' | 'vegan' | 'halal' | 'gluten-free' | 'dairy-free';

export type ShoppingCategory =
  | 'Produce'
  | 'Protein'
  | 'Grains & Bread'
  | 'Dairy & Eggs'
  | 'Canned & Pantry'
  | 'Spices & Condiments'
  | 'Frozen'
  | 'Oils & Fats';

export interface Ingredient {
  name: string;
  amount: string;
  category: ShoppingCategory;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  tags: DietTag[];
  photo: string;
  ingredients: Ingredient[];
  /**
   * Per-person nutritional values — sized for a proper adult portion
   * that contributes to a 2000–2500 kcal/day diet.
   * Breakfast ~500–600 kcal · Lunch ~600–750 kcal · Dinner ~750–900 kcal
   * Sources: USDA FoodData Central, NCC nutrient database
   */
  calories: number;
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  fiber: number;    // g
  sodium: number;   // mg
  costPerServing: number;
}

export const USDA_WEEKLY_MINIMUMS: Record<number, number> = {
  1: 47, 2: 87, 3: 122, 4: 155, 5: 183, 6: 213, 7: 242, 8: 271,
};
export function getUsdaMinimum(members: number): number {
  const clamped = Math.max(1, Math.min(8, members));
  const base = USDA_WEEKLY_MINIMUMS[clamped] ?? USDA_WEEKLY_MINIMUMS[8];
  return base + (members > 8 ? (members - 8) * 30 : 0);
}

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=300&q=75`;

export const MEALS: Meal[] = [
  // ── BREAKFASTS (~500–600 kcal per person) ────────────────────────────────

  {
    id: 'b1', name: 'Oatmeal with Banana, Peanut Butter & Honey',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1495214783159-3503fd1b572d'),
    ingredients: [
      { name: 'Rolled oats (GF certified)', amount: '¾ cup per person', category: 'Grains & Bread' },
      { name: 'Banana', amount: '1 per person', category: 'Produce' },
      { name: 'Natural peanut butter', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Honey', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Oat milk or water', amount: '1½ cups per person', category: 'Dairy & Eggs' },
      { name: 'Cinnamon & chia seeds', amount: '½ tsp + 1 tbsp per person', category: 'Spices & Condiments' },
    ],
    calories: 560, protein: 18, carbs: 78, fat: 18, fiber: 9, sodium: 80,
    costPerServing: 1.10,
  },
  {
    id: 'b2', name: 'Scrambled Eggs, Toast & Avocado',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    photo: U('1525351484163-7529414344d8'),
    ingredients: [
      { name: 'Eggs', amount: '3 per person', category: 'Dairy & Eggs' },
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Avocado', amount: '¼ per person', category: 'Produce' },
      { name: 'Butter', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Salt, pepper & chilli flakes', amount: 'to taste', category: 'Spices & Condiments' },
    ],
    calories: 530, protein: 27, carbs: 34, fat: 30, fiber: 7, sodium: 480,
    costPerServing: 1.50,
  },
  {
    id: 'b3', name: 'Greek Yogurt Parfait with Berries & Granola',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free'],
    photo: U('1488477181946-6428a0291777'),
    ingredients: [
      { name: 'Full-fat Greek yogurt', amount: '1½ cups per person', category: 'Dairy & Eggs' },
      { name: 'Mixed berries', amount: '¾ cup per person', category: 'Produce' },
      { name: 'GF granola', amount: '⅓ cup per person', category: 'Grains & Bread' },
      { name: 'Honey', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Walnuts (chopped)', amount: '1 tbsp per person', category: 'Canned & Pantry' },
    ],
    calories: 490, protein: 22, carbs: 52, fat: 18, fiber: 5, sodium: 90,
    costPerServing: 1.80,
  },
  {
    id: 'b4', name: 'Avocado Toast with Poached Eggs',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    photo: U('1541519227354-08fa5d50c820'),
    ingredients: [
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Avocado', amount: '½ per person', category: 'Produce' },
      { name: 'Eggs', amount: '2 per person', category: 'Dairy & Eggs' },
      { name: 'Lemon juice', amount: '1 tsp per person', category: 'Produce' },
      { name: 'Red pepper flakes & salt', amount: 'pinch each', category: 'Spices & Condiments' },
    ],
    calories: 520, protein: 24, carbs: 38, fat: 28, fiber: 10, sodium: 420,
    costPerServing: 1.90,
  },
  {
    id: 'b5', name: 'Berry Protein Smoothie Bowl',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1490645935967-10de6ba17061'),
    ingredients: [
      { name: 'Frozen banana', amount: '1½ per person', category: 'Frozen' },
      { name: 'Frozen mixed berries', amount: '1 cup per person', category: 'Frozen' },
      { name: 'Oat milk', amount: '½ cup per person', category: 'Dairy & Eggs' },
      { name: 'Chia seeds', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Hemp seeds', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Almond butter', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'GF granola (topping)', amount: '2 tbsp per person', category: 'Grains & Bread' },
    ],
    calories: 510, protein: 16, carbs: 62, fat: 20, fiber: 13, sodium: 55,
    costPerServing: 1.80,
  },
  {
    id: 'b6', name: 'Pancakes with Eggs & Maple Syrup',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    photo: U('1567620905732-2d1ec7ab7445'),
    ingredients: [
      { name: 'All-purpose flour', amount: '¾ cup per person', category: 'Grains & Bread' },
      { name: 'Egg', amount: '2 per person', category: 'Dairy & Eggs' },
      { name: 'Milk', amount: '¾ cup per person', category: 'Dairy & Eggs' },
      { name: 'Baking powder', amount: '1 tsp', category: 'Spices & Condiments' },
      { name: 'Maple syrup', amount: '3 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Butter', amount: '1 tsp per person', category: 'Oils & Fats' },
    ],
    calories: 580, protein: 18, carbs: 86, fat: 14, fiber: 3, sodium: 460,
    costPerServing: 1.20,
  },
  {
    id: 'b7', name: 'Savoury Congee with Egg & Sesame',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1547592180-85f173990554'),
    ingredients: [
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Low-sodium vegetable broth', amount: '3 cups per person', category: 'Canned & Pantry' },
      { name: 'Egg', amount: '1 per person', category: 'Dairy & Eggs' },
      { name: 'Fresh ginger', amount: '1 tsp grated', category: 'Produce' },
      { name: 'Green onion', amount: '2 stalks per person', category: 'Produce' },
      { name: 'Sesame oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Tamari', amount: '1 tbsp per person', category: 'Spices & Condiments' },
    ],
    calories: 420, protein: 12, carbs: 68, fat: 9, fiber: 2, sodium: 580,
    costPerServing: 0.90,
  },
  {
    id: 'b8', name: 'Peanut Butter Banana Toast with Seeds',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: U('1541442088-a36533bebafd'),
    ingredients: [
      { name: 'Whole wheat bread', amount: '3 slices per person', category: 'Grains & Bread' },
      { name: 'Natural peanut butter', amount: '3 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Banana', amount: '1 per person', category: 'Produce' },
      { name: 'Honey', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Sunflower seeds', amount: '1 tbsp per person', category: 'Canned & Pantry' },
    ],
    calories: 590, protein: 20, carbs: 70, fat: 24, fiber: 8, sodium: 370,
    costPerServing: 1.10,
  },
  {
    id: 'b9', name: 'Veggie Omelette with Whole Wheat Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free'],
    photo: U('1482049016688-2d3e1b311543'),
    ingredients: [
      { name: 'Eggs', amount: '3 per person', category: 'Dairy & Eggs' },
      { name: 'Bell pepper (diced)', amount: '¼ per person', category: 'Produce' },
      { name: 'Spinach', amount: '1 cup per person', category: 'Produce' },
      { name: 'Onion', amount: '¼ per person', category: 'Produce' },
      { name: 'Feta or cheddar', amount: '2 tbsp per person', category: 'Dairy & Eggs' },
      { name: 'Whole wheat toast', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
    ],
    calories: 520, protein: 28, carbs: 34, fat: 26, fiber: 5, sodium: 550,
    costPerServing: 1.60,
  },

  // ── LUNCHES (~600–750 kcal per person) ───────────────────────────────────

  {
    id: 'l1', name: 'Red Lentil Soup with Crusty Bread',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1547592166-23ac45744acd'),
    ingredients: [
      { name: 'Red lentils', amount: '¾ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Canned diced tomatoes', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Onion', amount: '¼ per person', category: 'Produce' },
      { name: 'Garlic', amount: '2 cloves', category: 'Produce' },
      { name: 'Carrot', amount: '½ per person', category: 'Produce' },
      { name: 'Cumin, turmeric, paprika', amount: '½ tsp each', category: 'Spices & Condiments' },
      { name: 'Low-sodium vegetable broth', amount: '2 cups per person', category: 'Canned & Pantry' },
      { name: 'Whole wheat bread (side)', amount: '1 thick slice per person', category: 'Grains & Bread' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
    ],
    calories: 620, protein: 26, carbs: 98, fat: 8, fiber: 22, sodium: 480,
    costPerServing: 1.10,
  },
  {
    id: 'l2', name: 'Halal Chicken, Brown Rice & Broccoli Bowl',
    type: 'lunch',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: U('1512058564366-18510be2db19'),
    ingredients: [
      { name: 'Halal boneless chicken thigh', amount: '5 oz per person', category: 'Protein' },
      { name: 'Brown rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Broccoli', amount: '1½ cups per person', category: 'Produce' },
      { name: 'Tamari (GF soy sauce)', amount: '2 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Garlic powder & ginger', amount: '½ tsp each', category: 'Spices & Condiments' },
      { name: 'Sesame seeds', amount: '1 tsp per person', category: 'Spices & Condiments' },
    ],
    calories: 680, protein: 44, carbs: 74, fat: 18, fiber: 7, sodium: 680,
    costPerServing: 2.60,
  },
  {
    id: 'l3', name: 'Black Bean & Corn Tacos (4 tacos)',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1565299585323-38d6b0865b47'),
    ingredients: [
      { name: 'Corn tortillas (6-inch)', amount: '4 per person', category: 'Grains & Bread' },
      { name: 'Canned black beans', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Corn kernels', amount: '½ cup per person', category: 'Frozen' },
      { name: 'Avocado', amount: '¼ per person', category: 'Produce' },
      { name: 'Shredded cabbage', amount: '¾ cup per person', category: 'Produce' },
      { name: 'Fresh salsa', amount: '3 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Lime', amount: '½ per person', category: 'Produce' },
    ],
    calories: 580, protein: 18, carbs: 96, fat: 14, fiber: 18, sodium: 420,
    costPerServing: 1.60,
  },
  {
    id: 'l4', name: 'Tuna Salad Sandwich with Side Salad',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    photo: U('1509722747041-616f39b57bea'),
    ingredients: [
      { name: 'Canned light tuna in water', amount: '4 oz per person', category: 'Canned & Pantry' },
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Vegan mayo', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Celery', amount: '2 stalks per person', category: 'Produce' },
      { name: 'Lettuce & tomato', amount: '½ cup per person', category: 'Produce' },
      { name: 'Mixed green salad (side)', amount: '2 cups per person', category: 'Produce' },
      { name: 'Olive oil & vinegar dressing', amount: '1 tbsp per person', category: 'Oils & Fats' },
    ],
    calories: 550, protein: 34, carbs: 42, fat: 22, fiber: 8, sodium: 680,
    costPerServing: 2.10,
  },
  {
    id: 'l5', name: 'Chickpea & Spinach Stew with Rice',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1455619452474-d2be8b1e70cd'),
    ingredients: [
      { name: 'Canned chickpeas', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Fresh spinach', amount: '3 cups per person', category: 'Produce' },
      { name: 'Canned diced tomatoes', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Garlic', amount: '3 cloves', category: 'Produce' },
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Cumin & smoked paprika', amount: '1 tsp each', category: 'Spices & Condiments' },
    ],
    calories: 610, protein: 20, carbs: 96, fat: 14, fiber: 16, sodium: 380,
    costPerServing: 1.40,
  },
  {
    id: 'l6', name: 'Whole Wheat Pasta with Marinara & Side Salad',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: U('1621996346565-e3dbc646d9a9'),
    ingredients: [
      { name: 'Whole wheat pasta', amount: '3 oz dry per person', category: 'Grains & Bread' },
      { name: 'Marinara sauce', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Garlic', amount: '3 cloves', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Fresh basil', amount: 'handful', category: 'Produce' },
      { name: 'Mixed salad greens (side)', amount: '2 cups per person', category: 'Produce' },
    ],
    calories: 590, protein: 18, carbs: 96, fat: 14, fiber: 12, sodium: 560,
    costPerServing: 1.20,
  },
  {
    id: 'l7', name: 'Vegetable Egg Fried Rice',
    type: 'lunch',
    tags: ['vegetarian', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1603133872878-684f208fb84b'),
    ingredients: [
      { name: 'Cooked white rice (day-old)', amount: '1½ cups per person', category: 'Grains & Bread' },
      { name: 'Eggs', amount: '3 per person', category: 'Dairy & Eggs' },
      { name: 'Frozen peas & carrots', amount: '¾ cup per person', category: 'Frozen' },
      { name: 'Sesame oil', amount: '1½ tsp per person', category: 'Oils & Fats' },
      { name: 'Tamari (GF soy sauce)', amount: '2 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Green onion', amount: '2 stalks per person', category: 'Produce' },
      { name: 'Garlic', amount: '2 cloves', category: 'Produce' },
    ],
    calories: 650, protein: 24, carbs: 86, fat: 20, fiber: 5, sodium: 760,
    costPerServing: 1.40,
  },
  {
    id: 'l8', name: 'Peanut Noodle Bowl with Edamame',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: U('1563379091339-03b21ab4a4f8'),
    ingredients: [
      { name: 'Rice noodles', amount: '3 oz dry per person', category: 'Grains & Bread' },
      { name: 'Natural peanut butter', amount: '3 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Edamame (shelled)', amount: '½ cup per person', category: 'Frozen' },
      { name: 'Soy sauce', amount: '2 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Shredded carrots', amount: '¾ cup per person', category: 'Produce' },
      { name: 'Cucumber', amount: '½ per person', category: 'Produce' },
      { name: 'Lime juice & chilli flakes', amount: '1 tbsp + pinch', category: 'Spices & Condiments' },
    ],
    calories: 680, protein: 26, carbs: 88, fat: 22, fiber: 8, sodium: 780,
    costPerServing: 1.80,
  },
  {
    id: 'l9', name: 'Halal Beef & Veggie Wrap with Salad',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    photo: U('1565958011703-44f9829ba187'),
    ingredients: [
      { name: 'Halal ground beef (lean)', amount: '4 oz per person', category: 'Protein' },
      { name: 'Large flour tortilla', amount: '1 per person', category: 'Grains & Bread' },
      { name: 'Lettuce, tomato, onion', amount: '¾ cup mixed per person', category: 'Produce' },
      { name: 'Hot sauce', amount: '1 tsp per person', category: 'Spices & Condiments' },
      { name: 'Avocado', amount: '¼ per person', category: 'Produce' },
      { name: 'Side salad greens', amount: '2 cups per person', category: 'Produce' },
    ],
    calories: 660, protein: 34, carbs: 60, fat: 28, fiber: 7, sodium: 620,
    costPerServing: 2.40,
  },

  // ── DINNERS (~750–900 kcal per person) ───────────────────────────────────

  {
    id: 'd1', name: 'Baked Chicken Thighs with Roasted Sweet Potato & Broccoli',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: U('1598103442097-8b74394b960e'),
    ingredients: [
      { name: 'Halal chicken thighs (bone-in)', amount: '6 oz per person', category: 'Protein' },
      { name: 'Sweet potato', amount: '1 large per person', category: 'Produce' },
      { name: 'Broccoli florets', amount: '1½ cups per person', category: 'Produce' },
      { name: 'Olive oil', amount: '2 tbsp per person', category: 'Oils & Fats' },
      { name: 'Garlic powder, smoked paprika, oregano', amount: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Lemon', amount: '¼ per person', category: 'Produce' },
    ],
    calories: 780, protein: 46, carbs: 62, fat: 34, fiber: 10, sodium: 440,
    costPerServing: 3.00,
  },
  {
    id: 'd2', name: 'Tofu & Vegetable Stir-Fry with Steamed Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1464454709131-ffd692591ee5'),
    ingredients: [
      { name: 'Extra-firm tofu', amount: '6 oz per person', category: 'Protein' },
      { name: 'Bell pepper', amount: '1 per person', category: 'Produce' },
      { name: 'Snap peas', amount: '1 cup per person', category: 'Produce' },
      { name: 'Carrots', amount: '1 cup sliced per person', category: 'Produce' },
      { name: 'Tamari (GF)', amount: '3 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Sesame oil', amount: '2 tsp per person', category: 'Oils & Fats' },
      { name: 'White rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Garlic & ginger', amount: '2 cloves + 1 tsp per person', category: 'Spices & Condiments' },
    ],
    calories: 750, protein: 30, carbs: 96, fat: 20, fiber: 8, sodium: 900,
    costPerServing: 2.20,
  },
  {
    id: 'd3', name: 'Halal Ground Beef Tacos with Beans & Salsa',
    type: 'dinner',
    tags: ['halal', 'gluten-free'],
    photo: U('1565299585323-38d6b0865b47'),
    ingredients: [
      { name: 'Halal lean ground beef', amount: '5 oz per person', category: 'Protein' },
      { name: 'Corn tortillas', amount: '4 per person', category: 'Grains & Bread' },
      { name: 'Canned black beans', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Shredded Mexican cheese', amount: '3 tbsp per person', category: 'Dairy & Eggs' },
      { name: 'Shredded lettuce & diced tomato', amount: '¾ cup per person', category: 'Produce' },
      { name: 'Taco seasoning', amount: '1½ tsp per person', category: 'Spices & Condiments' },
      { name: 'Sour cream or salsa', amount: '2 tbsp per person', category: 'Canned & Pantry' },
    ],
    calories: 820, protein: 46, carbs: 72, fat: 34, fiber: 10, sodium: 780,
    costPerServing: 3.20,
  },
  {
    id: 'd4', name: 'Red Lentil Dal with Basmati Rice & Naan',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1546554137-f5d421635ac7'),
    ingredients: [
      { name: 'Red lentils', amount: '¾ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Basmati rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Onion, garlic, fresh ginger', amount: '¼ onion, 3 cloves, 1 tsp per person', category: 'Produce' },
      { name: 'Light coconut milk', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Garam masala, turmeric, cumin', amount: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Canned diced tomatoes', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Spinach', amount: '1 cup per person', category: 'Produce' },
    ],
    calories: 820, protein: 30, carbs: 136, fat: 12, fiber: 18, sodium: 280,
    costPerServing: 1.70,
  },
  {
    id: 'd5', name: 'Halal Spaghetti Bolognese',
    type: 'dinner',
    tags: ['halal'],
    photo: U('1621996346565-e3dbc646d9a9'),
    ingredients: [
      { name: 'Whole wheat spaghetti', amount: '3 oz dry per person', category: 'Grains & Bread' },
      { name: 'Halal lean ground beef', amount: '4 oz per person', category: 'Protein' },
      { name: 'Marinara sauce', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Onion & garlic', amount: '¼ onion, 3 cloves per person', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Parmesan cheese', amount: '3 tbsp per person', category: 'Dairy & Eggs' },
      { name: 'Mixed herbs (oregano, basil)', amount: '1 tsp each', category: 'Spices & Condiments' },
    ],
    calories: 800, protein: 42, carbs: 82, fat: 28, fiber: 9, sodium: 680,
    costPerServing: 2.80,
  },
  {
    id: 'd6', name: 'Black Bean Burrito Bowl with Guacamole',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1512058564366-18510be2db19'),
    ingredients: [
      { name: 'White rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Canned black beans', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Frozen corn', amount: '½ cup per person', category: 'Frozen' },
      { name: 'Avocado (guacamole)', amount: '½ per person', category: 'Produce' },
      { name: 'Fresh salsa', amount: '4 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Lime', amount: '½ per person', category: 'Produce' },
      { name: 'Cilantro & cumin', amount: 'handful + 1 tsp per person', category: 'Spices & Condiments' },
    ],
    calories: 760, protein: 20, carbs: 120, fat: 20, fiber: 18, sodium: 360,
    costPerServing: 2.10,
  },
  {
    id: 'd7', name: 'Baked Salmon with Quinoa & Roasted Asparagus',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: U('1467003909585-2f8a72700288'),
    ingredients: [
      { name: 'Atlantic salmon fillet', amount: '5 oz per person', category: 'Protein' },
      { name: 'Quinoa', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Asparagus', amount: '8 spears per person', category: 'Produce' },
      { name: 'Lemon', amount: '½ per person', category: 'Produce' },
      { name: 'Olive oil', amount: '2 tbsp per person', category: 'Oils & Fats' },
      { name: 'Garlic & dill', amount: '2 cloves, 1 tsp per person', category: 'Spices & Condiments' },
    ],
    calories: 800, protein: 50, carbs: 62, fat: 32, fiber: 9, sodium: 380,
    costPerServing: 4.20,
  },
  {
    id: 'd8', name: 'Lentil & Mushroom Shepherd\'s Pie',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    photo: U('1574484284002-952d92a03a40'),
    ingredients: [
      { name: 'Brown mushrooms', amount: '1½ cups per person', category: 'Produce' },
      { name: 'Green lentils', amount: '½ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Russet potato (mash topping)', amount: '2 medium per person', category: 'Produce' },
      { name: 'Onion, carrot, celery', amount: '⅓ cup each per person', category: 'Produce' },
      { name: 'Low-sodium vegetable broth', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Thyme, rosemary & garlic', amount: '½ tsp each + 2 cloves', category: 'Spices & Condiments' },
    ],
    calories: 760, protein: 26, carbs: 118, fat: 14, fiber: 20, sodium: 390,
    costPerServing: 2.30,
  },
  {
    id: 'd9', name: 'Chickpea Coconut Curry with Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: U('1455619452474-d2be8b1e70cd'),
    ingredients: [
      { name: 'Canned chickpeas', amount: '¾ cup per person', category: 'Canned & Pantry' },
      { name: 'Full-fat coconut milk', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Canned diced tomatoes', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Curry powder, cumin, coriander, turmeric', amount: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Onion, garlic & ginger', amount: '¼ onion, 3 cloves, 1 tsp per person', category: 'Produce' },
      { name: 'White rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Spinach', amount: '1 cup per person', category: 'Produce' },
    ],
    calories: 780, protein: 20, carbs: 116, fat: 22, fiber: 14, sodium: 360,
    costPerServing: 1.90,
  },
  {
    id: 'd10', name: 'Garlic Shrimp, Vegetable Rice & Side Salad',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: U('1563379091339-03b21ab4a4f8'),
    ingredients: [
      { name: 'Shrimp (peeled & deveined)', amount: '5 oz per person', category: 'Protein' },
      { name: 'White rice', amount: '¾ cup dry per person', category: 'Grains & Bread' },
      { name: 'Zucchini & bell pepper', amount: '½ each per person', category: 'Produce' },
      { name: 'Garlic', amount: '4 cloves per person', category: 'Produce' },
      { name: 'Olive oil', amount: '2 tbsp per person', category: 'Oils & Fats' },
      { name: 'Lemon & parsley', amount: '½ lemon + handful per person', category: 'Produce' },
      { name: 'Mixed green salad (side)', amount: '2 cups per person', category: 'Produce' },
    ],
    calories: 760, protein: 40, carbs: 80, fat: 26, fiber: 5, sodium: 520,
    costPerServing: 3.40,
  },
];
