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
  photo: string; // Unsplash photo URL
  ingredients: Ingredient[];
  // Per-person values (scaled by household at runtime)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  costPerServing: number;
}

export const USDA_WEEKLY_MINIMUMS: Record<number, number> = {
  1: 47, 2: 87, 3: 122, 4: 155, 5: 183, 6: 213, 7: 242, 8: 271,
};

export function getUsdaMinimum(members: number): number {
  const clamped = Math.max(1, Math.min(8, members));
  const base = USDA_WEEKLY_MINIMUMS[clamped] ?? USDA_WEEKLY_MINIMUMS[8];
  const extra = members > 8 ? (members - 8) * 30 : 0;
  return base + extra;
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=300&q=75`;

export const MEALS: Meal[] = [
  // ─── BREAKFASTS ─────────────────────────────────────────────────────────────
  {
    id: 'b1',
    name: 'Oatmeal with Banana & Honey',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1495214783159-3503fd1b572d'),
    ingredients: [
      { name: 'Rolled oats (GF certified)', amount: '½ cup per person', category: 'Grains & Bread' },
      { name: 'Banana', amount: '1 per person', category: 'Produce' },
      { name: 'Honey', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Cinnamon', amount: 'pinch', category: 'Spices & Condiments' },
      { name: 'Oat milk or water', amount: '1 cup per person', category: 'Dairy & Eggs' },
    ],
    calories: 364, protein: 8, carbs: 74, fat: 4, fiber: 7, sodium: 15,
    costPerServing: 0.85,
  },
  {
    id: 'b2',
    name: 'Scrambled Eggs & Whole Wheat Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    photo: UNSPLASH('1525351484163-7529414344d8'),
    ingredients: [
      { name: 'Eggs', amount: '2 per person', category: 'Dairy & Eggs' },
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Butter', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Salt & pepper', amount: 'to taste', category: 'Spices & Condiments' },
    ],
    calories: 334, protein: 20, carbs: 29, fat: 16, fiber: 4, sodium: 420,
    costPerServing: 1.10,
  },
  {
    id: 'b3',
    name: 'Greek Yogurt with Berries & Granola',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free'],
    photo: UNSPLASH('1488477181946-6428a0291777'),
    ingredients: [
      { name: 'Plain Greek yogurt', amount: '1 cup per person', category: 'Dairy & Eggs' },
      { name: 'Mixed berries', amount: '½ cup per person', category: 'Produce' },
      { name: 'GF granola', amount: '2 tbsp per person', category: 'Grains & Bread' },
      { name: 'Honey', amount: '1 tsp per person', category: 'Canned & Pantry' },
    ],
    calories: 281, protein: 14, carbs: 36, fat: 9, fiber: 3, sodium: 60,
    costPerServing: 1.40,
  },
  {
    id: 'b4',
    name: 'Avocado Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: UNSPLASH('1541519227354-08fa5d50c820'),
    ingredients: [
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Avocado', amount: '½ per person', category: 'Produce' },
      { name: 'Lemon juice', amount: '1 tsp per person', category: 'Produce' },
      { name: 'Red pepper flakes & salt', amount: 'pinch', category: 'Spices & Condiments' },
    ],
    calories: 295, protein: 8, carbs: 32, fat: 16, fiber: 8, sodium: 310,
    costPerServing: 1.60,
  },
  {
    id: 'b5',
    name: 'Berry Smoothie Bowl',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1490645935967-10de6ba17061'),
    ingredients: [
      { name: 'Frozen banana', amount: '1 per person', category: 'Frozen' },
      { name: 'Frozen mixed berries', amount: '½ cup per person', category: 'Frozen' },
      { name: 'Oat milk', amount: '¼ cup per person', category: 'Dairy & Eggs' },
      { name: 'Chia seeds', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Hemp seeds', amount: '1 tbsp per person', category: 'Canned & Pantry' },
    ],
    calories: 277, protein: 9, carbs: 44, fat: 9, fiber: 10, sodium: 30,
    costPerServing: 1.25,
  },
  {
    id: 'b6',
    name: 'Fluffy Pancakes with Maple Syrup',
    type: 'breakfast',
    tags: ['vegetarian', 'halal'],
    photo: UNSPLASH('1567620905732-2d1ec7ab7445'),
    ingredients: [
      { name: 'All-purpose flour', amount: '½ cup per person', category: 'Grains & Bread' },
      { name: 'Egg', amount: '1 per person', category: 'Dairy & Eggs' },
      { name: 'Milk', amount: '½ cup per person', category: 'Dairy & Eggs' },
      { name: 'Baking powder', amount: '1 tsp', category: 'Spices & Condiments' },
      { name: 'Maple syrup', amount: '2 tbsp per person', category: 'Canned & Pantry' },
    ],
    calories: 390, protein: 10, carbs: 68, fat: 8, fiber: 2, sodium: 380,
    costPerServing: 0.95,
  },
  {
    id: 'b7',
    name: 'Ginger Rice Porridge (Congee)',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1547592180-85f173990554'),
    ingredients: [
      { name: 'White rice', amount: '¼ cup dry per person', category: 'Grains & Bread' },
      { name: 'Low-sodium vegetable broth', amount: '2 cups per person', category: 'Canned & Pantry' },
      { name: 'Fresh ginger', amount: '1 tsp grated', category: 'Produce' },
      { name: 'Green onion', amount: '1 stalk per person', category: 'Produce' },
      { name: 'Sesame oil', amount: '½ tsp per person', category: 'Oils & Fats' },
    ],
    calories: 215, protein: 4, carbs: 42, fat: 3, fiber: 1, sodium: 320,
    costPerServing: 0.55,
  },
  {
    id: 'b8',
    name: 'Peanut Butter Banana Toast',
    type: 'breakfast',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: UNSPLASH('1541442088-a36533bebafd'),
    ingredients: [
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Natural peanut butter', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Banana', amount: '½ per person', category: 'Produce' },
      { name: 'Honey', amount: '1 tsp per person', category: 'Canned & Pantry' },
    ],
    calories: 423, protein: 14, carbs: 52, fat: 17, fiber: 6, sodium: 290,
    costPerServing: 0.90,
  },
  {
    id: 'b9',
    name: 'Boiled Eggs & Seasonal Fruit Plate',
    type: 'breakfast',
    tags: ['vegetarian', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1482049016688-2d3e1b311543'),
    ingredients: [
      { name: 'Eggs', amount: '2 per person', category: 'Dairy & Eggs' },
      { name: 'Seasonal fruit', amount: '1 cup per person', category: 'Produce' },
      { name: 'Olive oil drizzle', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Salt & pepper', amount: 'to taste', category: 'Spices & Condiments' },
    ],
    calories: 260, protein: 13, carbs: 20, fat: 14, fiber: 3, sodium: 130,
    costPerServing: 1.00,
  },

  // ─── LUNCHES ────────────────────────────────────────────────────────────────
  {
    id: 'l1',
    name: 'Red Lentil Soup',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1547592166-23ac45744acd'),
    ingredients: [
      { name: 'Red lentils', amount: '½ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Canned diced tomatoes', amount: '⅓ cup per person', category: 'Canned & Pantry' },
      { name: 'Onion', amount: '¼ per person', category: 'Produce' },
      { name: 'Garlic', amount: '2 cloves per person', category: 'Produce' },
      { name: 'Cumin, turmeric, paprika', amount: '½ tsp each', category: 'Spices & Condiments' },
      { name: 'Low-sodium vegetable broth', amount: '1½ cups per person', category: 'Canned & Pantry' },
    ],
    calories: 298, protein: 18, carbs: 50, fat: 2, fiber: 16, sodium: 340,
    costPerServing: 0.90,
  },
  {
    id: 'l2',
    name: 'Halal Chicken & Brown Rice Bowl',
    type: 'lunch',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1512058564366-18510be2db19'),
    ingredients: [
      { name: 'Halal boneless chicken thigh', amount: '4 oz per person', category: 'Protein' },
      { name: 'Brown rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Broccoli', amount: '1 cup per person', category: 'Produce' },
      { name: 'Tamari (GF soy sauce)', amount: '1 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Garlic powder', amount: '½ tsp', category: 'Spices & Condiments' },
    ],
    calories: 498, protein: 34, carbs: 54, fat: 12, fiber: 5, sodium: 590,
    costPerServing: 2.20,
  },
  {
    id: 'l3',
    name: 'Black Bean Corn Tacos',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1565299585323-38d6b0865b47'),
    ingredients: [
      { name: 'Corn tortillas (6-inch)', amount: '3 per person', category: 'Grains & Bread' },
      { name: 'Canned black beans', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Corn kernels', amount: '¼ cup per person', category: 'Frozen' },
      { name: 'Shredded cabbage', amount: '½ cup per person', category: 'Produce' },
      { name: 'Fresh salsa', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Lime', amount: '¼ per person', category: 'Produce' },
    ],
    calories: 340, protein: 13, carbs: 66, fat: 4, fiber: 12, sodium: 310,
    costPerServing: 1.30,
  },
  {
    id: 'l4',
    name: 'Tuna Salad Sandwich',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    photo: UNSPLASH('1509722747041-616f39b57bea'),
    ingredients: [
      { name: 'Canned light tuna in water', amount: '3 oz per person', category: 'Canned & Pantry' },
      { name: 'Whole wheat bread', amount: '2 slices per person', category: 'Grains & Bread' },
      { name: 'Vegan mayo', amount: '1 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Celery', amount: '1 stalk per person', category: 'Produce' },
      { name: 'Lettuce & tomato', amount: '2 leaves + 2 slices per person', category: 'Produce' },
    ],
    calories: 346, protein: 27, carbs: 31, fat: 12, fiber: 5, sodium: 560,
    costPerServing: 1.80,
  },
  {
    id: 'l5',
    name: 'Chickpea & Spinach Stew',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1455619452474-d2be8b1e70cd'),
    ingredients: [
      { name: 'Canned chickpeas', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Fresh spinach', amount: '2 cups per person', category: 'Produce' },
      { name: 'Canned diced tomatoes', amount: '¼ cup per person', category: 'Canned & Pantry' },
      { name: 'Garlic', amount: '2 cloves', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Cumin & smoked paprika', amount: '½ tsp each', category: 'Spices & Condiments' },
    ],
    calories: 230, protein: 10, carbs: 32, fat: 7, fiber: 9, sodium: 320,
    costPerServing: 1.10,
  },
  {
    id: 'l6',
    name: 'Whole Wheat Pasta with Marinara',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: UNSPLASH('1621996346565-e3dbc646d9a9'),
    ingredients: [
      { name: 'Whole wheat pasta', amount: '2 oz dry per person', category: 'Grains & Bread' },
      { name: 'Marinara sauce', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Garlic', amount: '2 cloves', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Fresh basil', amount: 'handful', category: 'Produce' },
    ],
    calories: 322, protein: 11, carbs: 58, fat: 7, fiber: 7, sodium: 480,
    costPerServing: 1.00,
  },
  {
    id: 'l7',
    name: 'Vegetable Egg Fried Rice',
    type: 'lunch',
    tags: ['vegetarian', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1603133872878-684f208fb84b'),
    ingredients: [
      { name: 'Cooked white rice (day-old)', amount: '1 cup per person', category: 'Grains & Bread' },
      { name: 'Eggs', amount: '2 per person', category: 'Dairy & Eggs' },
      { name: 'Frozen peas & carrots', amount: '½ cup per person', category: 'Frozen' },
      { name: 'Sesame oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Tamari (GF soy sauce)', amount: '1 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Green onion', amount: '1 stalk per person', category: 'Produce' },
    ],
    calories: 451, protein: 17, carbs: 60, fat: 14, fiber: 3, sodium: 640,
    costPerServing: 1.20,
  },
  {
    id: 'l8',
    name: 'Peanut Noodle Bowl',
    type: 'lunch',
    tags: ['vegetarian', 'vegan', 'halal', 'dairy-free'],
    photo: UNSPLASH('1563379091339-03b21ab4a4f8'),
    ingredients: [
      { name: 'Rice noodles', amount: '2 oz dry per person', category: 'Grains & Bread' },
      { name: 'Natural peanut butter', amount: '2 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Soy sauce', amount: '1 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Shredded carrots', amount: '½ cup per person', category: 'Produce' },
      { name: 'Cucumber', amount: '½ per person', category: 'Produce' },
      { name: 'Lime juice', amount: '1 tsp per person', category: 'Produce' },
    ],
    calories: 436, protein: 13, carbs: 62, fat: 15, fiber: 4, sodium: 680,
    costPerServing: 1.40,
  },
  {
    id: 'l9',
    name: 'Halal Beef & Veggie Wrap',
    type: 'lunch',
    tags: ['halal', 'dairy-free'],
    photo: UNSPLASH('1565958011703-44f9829ba187'),
    ingredients: [
      { name: 'Halal ground beef (lean)', amount: '3 oz per person', category: 'Protein' },
      { name: 'Large flour tortilla', amount: '1 per person', category: 'Grains & Bread' },
      { name: 'Lettuce, tomato, onion', amount: '½ cup mixed per person', category: 'Produce' },
      { name: 'Hot sauce', amount: '1 tsp per person', category: 'Spices & Condiments' },
      { name: 'Olive oil', amount: '½ tsp per person', category: 'Oils & Fats' },
    ],
    calories: 447, protein: 26, carbs: 43, fat: 17, fiber: 3, sodium: 540,
    costPerServing: 2.10,
  },

  // ─── DINNERS ────────────────────────────────────────────────────────────────
  {
    id: 'd1',
    name: 'Baked Chicken Thighs & Roasted Vegetables',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1598103442097-8b74394b960e'),
    ingredients: [
      { name: 'Halal chicken thighs (bone-in)', amount: '5 oz per person', category: 'Protein' },
      { name: 'Sweet potato', amount: '1 medium per person', category: 'Produce' },
      { name: 'Broccoli florets', amount: '1 cup per person', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Garlic powder, smoked paprika, oregano', amount: '1 tsp each', category: 'Spices & Condiments' },
    ],
    calories: 495, protein: 36, carbs: 38, fat: 20, fiber: 7, sodium: 390,
    costPerServing: 2.60,
  },
  {
    id: 'd2',
    name: 'Tofu & Vegetable Stir-Fry with Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1464454709131-ffd692591ee5'),
    ingredients: [
      { name: 'Extra-firm tofu', amount: '4 oz per person', category: 'Protein' },
      { name: 'Bell pepper', amount: '½ per person', category: 'Produce' },
      { name: 'Snap peas', amount: '½ cup per person', category: 'Produce' },
      { name: 'Carrots', amount: '½ cup sliced per person', category: 'Produce' },
      { name: 'Tamari (GF)', amount: '2 tbsp per person', category: 'Spices & Condiments' },
      { name: 'Sesame oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
    ],
    calories: 438, protein: 22, carbs: 62, fat: 11, fiber: 5, sodium: 780,
    costPerServing: 1.80,
  },
  {
    id: 'd3',
    name: 'Halal Ground Beef Tacos',
    type: 'dinner',
    tags: ['halal', 'gluten-free'],
    photo: UNSPLASH('1565299585323-38d6b0865b47'),
    ingredients: [
      { name: 'Halal lean ground beef', amount: '4 oz per person', category: 'Protein' },
      { name: 'Corn tortillas', amount: '3 per person', category: 'Grains & Bread' },
      { name: 'Shredded Mexican cheese blend', amount: '2 tbsp per person', category: 'Dairy & Eggs' },
      { name: 'Shredded lettuce', amount: '½ cup per person', category: 'Produce' },
      { name: 'Roma tomato, diced', amount: '1 per person', category: 'Produce' },
      { name: 'Taco seasoning', amount: '1 tsp per person', category: 'Spices & Condiments' },
    ],
    calories: 497, protein: 33, carbs: 40, fat: 22, fiber: 5, sodium: 620,
    costPerServing: 2.80,
  },
  {
    id: 'd4',
    name: 'Red Lentil Dal with Basmati Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1546554137-f5d421635ac7'),
    ingredients: [
      { name: 'Red lentils', amount: '½ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Basmati rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Onion', amount: '¼ per person', category: 'Produce' },
      { name: 'Garlic & fresh ginger', amount: '2 cloves, 1 tsp per person', category: 'Produce' },
      { name: 'Light coconut milk', amount: '¼ cup per person', category: 'Canned & Pantry' },
      { name: 'Garam masala, turmeric, cumin', amount: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Canned diced tomatoes', amount: '¼ cup per person', category: 'Canned & Pantry' },
    ],
    calories: 530, protein: 22, carbs: 90, fat: 8, fiber: 14, sodium: 190,
    costPerServing: 1.40,
  },
  {
    id: 'd5',
    name: 'Halal Spaghetti Bolognese',
    type: 'dinner',
    tags: ['halal'],
    photo: UNSPLASH('1621996346565-e3dbc646d9a9'),
    ingredients: [
      { name: 'Whole wheat spaghetti', amount: '2 oz dry per person', category: 'Grains & Bread' },
      { name: 'Halal lean ground beef', amount: '3 oz per person', category: 'Protein' },
      { name: 'Marinara sauce', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Onion & garlic', amount: '¼ onion, 2 cloves per person', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tsp per person', category: 'Oils & Fats' },
      { name: 'Parmesan cheese', amount: '2 tbsp per person', category: 'Dairy & Eggs' },
    ],
    calories: 515, protein: 30, carbs: 54, fat: 18, fiber: 6, sodium: 590,
    costPerServing: 2.40,
  },
  {
    id: 'd6',
    name: 'Black Bean Burrito Bowl',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1512058564366-18510be2db19'),
    ingredients: [
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Canned black beans', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Frozen corn', amount: '¼ cup per person', category: 'Frozen' },
      { name: 'Fresh salsa', amount: '3 tbsp per person', category: 'Canned & Pantry' },
      { name: 'Avocado', amount: '¼ per person', category: 'Produce' },
      { name: 'Lime', amount: '¼ per person', category: 'Produce' },
      { name: 'Cilantro', amount: 'handful', category: 'Produce' },
    ],
    calories: 455, protein: 14, carbs: 80, fat: 9, fiber: 12, sodium: 280,
    costPerServing: 1.70,
  },
  {
    id: 'd7',
    name: 'Baked Salmon with Quinoa & Asparagus',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1467003909585-2f8a72700288'),
    ingredients: [
      { name: 'Atlantic salmon fillet', amount: '4 oz per person', category: 'Protein' },
      { name: 'Quinoa', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Asparagus', amount: '6 spears per person', category: 'Produce' },
      { name: 'Lemon', amount: '¼ per person', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Dill & garlic', amount: '½ tsp dill, 1 clove per person', category: 'Spices & Condiments' },
    ],
    calories: 539, protein: 38, carbs: 40, fat: 22, fiber: 6, sodium: 300,
    costPerServing: 3.50,
  },
  {
    id: 'd8',
    name: 'Lentil & Mushroom Shepherd\'s Pie',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1574484284002-952d92a03a40'),
    ingredients: [
      { name: 'Brown mushrooms', amount: '1 cup per person', category: 'Produce' },
      { name: 'Green lentils', amount: '⅓ cup dry per person', category: 'Canned & Pantry' },
      { name: 'Russet potato (mashed topping)', amount: '1 medium per person', category: 'Produce' },
      { name: 'Onion, carrot, celery', amount: '¼ cup each per person', category: 'Produce' },
      { name: 'Low-sodium vegetable broth', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Thyme & rosemary', amount: '½ tsp each', category: 'Spices & Condiments' },
    ],
    calories: 430, protein: 18, carbs: 75, fat: 4, fiber: 14, sodium: 310,
    costPerServing: 1.90,
  },
  {
    id: 'd9',
    name: 'Chickpea Coconut Curry with Rice',
    type: 'dinner',
    tags: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1455619452474-d2be8b1e70cd'),
    ingredients: [
      { name: 'Canned chickpeas', amount: '½ cup per person', category: 'Canned & Pantry' },
      { name: 'Light coconut milk', amount: '¼ cup per person', category: 'Canned & Pantry' },
      { name: 'Canned diced tomatoes', amount: '¼ cup per person', category: 'Canned & Pantry' },
      { name: 'Curry powder, cumin, coriander', amount: '1 tsp each', category: 'Spices & Condiments' },
      { name: 'Onion & garlic', amount: '¼ onion, 2 cloves', category: 'Produce' },
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
    ],
    calories: 458, protein: 14, carbs: 79, fat: 10, fiber: 10, sodium: 290,
    costPerServing: 1.60,
  },
  {
    id: 'd10',
    name: 'Garlic Shrimp & Vegetable Rice',
    type: 'dinner',
    tags: ['halal', 'gluten-free', 'dairy-free'],
    photo: UNSPLASH('1563379091339-03b21ab4a4f8'),
    ingredients: [
      { name: 'Shrimp (peeled & deveined)', amount: '4 oz per person', category: 'Protein' },
      { name: 'White rice', amount: '½ cup dry per person', category: 'Grains & Bread' },
      { name: 'Zucchini', amount: '½ medium per person', category: 'Produce' },
      { name: 'Garlic', amount: '3 cloves per person', category: 'Produce' },
      { name: 'Olive oil', amount: '1 tbsp per person', category: 'Oils & Fats' },
      { name: 'Lemon', amount: '¼ per person', category: 'Produce' },
      { name: 'Fresh parsley', amount: 'handful', category: 'Produce' },
    ],
    calories: 430, protein: 29, carbs: 50, fat: 13, fiber: 2, sodium: 440,
    costPerServing: 2.80,
  },
];
