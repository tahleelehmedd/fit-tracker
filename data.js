/* ==================
   FIT TRACKER v6 — DATA
   ================== */

const APP_VERSION = '6.0';
const START_DATE = '2026-05-25';
const TARGET_DATE = '2026-08-20';
const START_WEIGHT = 78.0;
const TARGET_WEIGHT = 70.0;
const TARGET_CALORIES = 1750;
const TARGET_PROTEIN = 160;
const TARGET_WATER_L = 4.0;
const WATER_CUPS = 16;

// ===== GYM TIMING PRESETS =====
// Each preset reorders meals around when you train
const GYM_TIMING_PRESETS = {
  earlyMorning: {
    label: 'Early morning (before breakfast)',
    icon: '🌅',
    order: ['preworkout', 'postworkout', 'breakfast', 'midmorning', 'lunch', 'snack', 'dinner']
  },
  morning: {
    label: 'Morning (after breakfast)',
    icon: '☀️',
    order: ['breakfast', 'preworkout', 'postworkout', 'midmorning', 'lunch', 'snack', 'dinner']
  },
  afternoon: {
    label: 'Afternoon',
    icon: '🌤',
    order: ['breakfast', 'midmorning', 'preworkout', 'postworkout', 'lunch', 'snack', 'dinner']
  },
  evening: {
    label: 'Evening (after work)',
    icon: '🌆',
    order: ['breakfast', 'midmorning', 'lunch', 'snack', 'preworkout', 'postworkout', 'dinner']
  },
  lateNight: {
    label: 'Late night',
    icon: '🌙',
    order: ['breakfast', 'midmorning', 'lunch', 'snack', 'dinner', 'preworkout', 'postworkout']
  }
};

// ===== MEAL COMPONENT SWAPS =====
// What you can swap an individual component for, while staying on-plan
const COMPONENT_SWAPS = {
  carb_grain: {
    label: 'Carb',
    options: [
      { name: '1 multigrain roti', kcal: 110, protein: 4, carbs: 22, fat: 2 },
      { name: '½ cup brown rice', kcal: 110, protein: 3, carbs: 23, fat: 1 },
      { name: '½ cup quinoa', kcal: 110, protein: 4, carbs: 20, fat: 2 },
      { name: '1 cup cauliflower rice', kcal: 25, protein: 2, carbs: 5, fat: 0 },
      { name: 'Small sweet potato', kcal: 100, protein: 2, carbs: 23, fat: 0 },
      { name: '1 slice multigrain bread', kcal: 80, protein: 3, carbs: 14, fat: 1 },
      { name: 'Skip carb today', kcal: 0, protein: 0, carbs: 0, fat: 0 }
    ]
  },
  protein_main: {
    label: 'Protein',
    options: [
      { name: '150g grilled chicken', kcal: 240, protein: 42, carbs: 0, fat: 6 },
      { name: '150g chicken tikka (oven)', kcal: 250, protein: 40, carbs: 4, fat: 8 },
      { name: '150g pan-seared fish', kcal: 220, protein: 38, carbs: 0, fat: 8 },
      { name: '150g salmon', kcal: 290, protein: 35, carbs: 0, fat: 16 },
      { name: '120g lean beef strips', kcal: 240, protein: 32, carbs: 0, fat: 12 },
      { name: '3 eggs + 2 whites scrambled', kcal: 280, protein: 26, carbs: 2, fat: 18 },
      { name: '80g paneer + 2 eggs', kcal: 360, protein: 26, carbs: 4, fat: 26 }
    ]
  },
  veg_side: {
    label: 'Vegetable',
    options: [
      { name: 'Mixed salad with olive oil-lemon', kcal: 80, protein: 2, carbs: 8, fat: 5 },
      { name: 'Sautéed spinach + garlic', kcal: 60, protein: 3, carbs: 6, fat: 3 },
      { name: 'Roasted vegetables (zucchini, peppers, carrot)', kcal: 90, protein: 2, carbs: 12, fat: 4 },
      { name: 'Cucumber-tomato-onion salad', kcal: 45, protein: 1, carbs: 9, fat: 0 },
      { name: 'Steamed broccoli + lemon', kcal: 45, protein: 4, carbs: 8, fat: 0 },
      { name: 'Cucumber raita (yogurt-cucumber)', kcal: 60, protein: 4, carbs: 6, fat: 2 }
    ]
  },
  drink: {
    label: 'Drink',
    options: [
      { name: 'Water', kcal: 0, protein: 0, carbs: 0, fat: 0 },
      { name: 'Black coffee', kcal: 5, protein: 0, carbs: 1, fat: 0 },
      { name: 'Green tea', kcal: 0, protein: 0, carbs: 0, fat: 0 },
      { name: 'Chamomile tea', kcal: 0, protein: 0, carbs: 0, fat: 0 },
      { name: 'Lemon water', kcal: 5, protein: 0, carbs: 1, fat: 0 }
    ]
  }
};

// ===== MEAL LIBRARY (60+ meals, sub-itemised, multi-cuisine) =====
// Each meal has 'items' array — components you can check individually
const MEAL_LIBRARY = {
  breakfast: [
    { id: 'b1', name: 'Masala oats with eggs', cuisine: '🇮🇳', kcal: 420, protein: 28, carbs: 38, fat: 16,
      items: [
        { id: 'b1a', text: '½ cup oats cooked with onion, tomato, green chili, turmeric', swap: 'carb_grain', kcal: 200, protein: 6 },
        { id: 'b1b', text: '2 boiled eggs', swap: 'protein_main', kcal: 140, protein: 12 },
        { id: 'b1c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'Cook oats in water (1:2 ratio). Add diced onion/tomato/chili while cooking. Finish with coriander. Eggs boiled separately, 8 min.' },

    { id: 'b2', name: 'Anda bhurji + roti', cuisine: '🇮🇳', kcal: 430, protein: 26, carbs: 32, fat: 20,
      items: [
        { id: 'b2a', text: '3 eggs scrambled with onion, tomato, chili, turmeric', swap: 'protein_main', kcal: 280, protein: 22 },
        { id: 'b2b', text: '1 multigrain roti', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'b2c', text: 'Green tea or coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: '1 tsp olive oil only. Onion + tomato + chili first, then eggs. No cream/ghee.' },

    { id: 'b3', name: 'Shakshuka', cuisine: '🇦🇪', kcal: 440, protein: 26, carbs: 24, fat: 26,
      items: [
        { id: 'b3a', text: '3 eggs poached in spiced tomato-pepper sauce', swap: 'protein_main', kcal: 350, protein: 22 },
        { id: 'b3b', text: '1 slice multigrain bread', swap: 'carb_grain', kcal: 80, protein: 3 },
        { id: 'b3c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'Pan: 1 tsp olive oil, sauté onion+pepper+tomato 5 min, crack eggs on top, cover and cook 5 min.' },

    { id: 'b4', name: 'Greek yogurt power bowl', cuisine: '🇬🇷', kcal: 410, protein: 24, carbs: 42, fat: 14,
      items: [
        { id: 'b4a', text: '200g Greek yogurt', swap: 'protein_main', kcal: 180, protein: 18 },
        { id: 'b4b', text: '30g rolled oats + cinnamon', swap: 'carb_grain', kcal: 110, protein: 3 },
        { id: 'b4c', text: '5 walnut halves + ½ banana', swap: null, kcal: 120, protein: 3 }
      ],
      helper: 'Assemble in bowl. No prep.' },

    { id: 'b5', name: 'Egg-paneer scramble', cuisine: '🇮🇳', kcal: 460, protein: 34, carbs: 18, fat: 28,
      items: [
        { id: 'b5a', text: '2 eggs + 60g paneer crumbled with spinach, onion, turmeric, cumin', swap: 'protein_main', kcal: 360, protein: 28 },
        { id: 'b5b', text: '1 multigrain roti', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'b5c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'Pan-scramble eggs + paneer + greens in 1 tsp olive oil.' },

    { id: 'b6', name: 'Chana chaat + boiled eggs', cuisine: '🇵🇰', kcal: 420, protein: 28, carbs: 44, fat: 12,
      items: [
        { id: 'b6a', text: '1 cup boiled chickpeas + onion, tomato, cucumber, lemon, chaat masala', swap: 'carb_grain', kcal: 250, protein: 14 },
        { id: 'b6b', text: '2 boiled eggs', swap: 'protein_main', kcal: 140, protein: 12 },
        { id: 'b6c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'Boil chickpeas day before or use canned (rinsed). Assemble cold.' },

    { id: 'b7', name: 'Avocado-egg toast', cuisine: '🌍', kcal: 440, protein: 22, carbs: 32, fat: 24,
      items: [
        { id: 'b7a', text: '1 slice multigrain toast + ½ avocado smashed', swap: 'carb_grain', kcal: 240, protein: 6 },
        { id: 'b7b', text: '2 poached or fried eggs', swap: 'protein_main', kcal: 180, protein: 14 },
        { id: 'b7c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'Toast bread, mash avocado with lemon+salt+chili. Cook eggs in 1 tsp olive oil.' },

    { id: 'b8', name: 'Tofu-spinach scramble', cuisine: '🇯🇵', kcal: 380, protein: 26, carbs: 28, fat: 18,
      items: [
        { id: 'b8a', text: '150g firm tofu crumbled with spinach, turmeric, garlic', swap: 'protein_main', kcal: 220, protein: 20 },
        { id: 'b8b', text: '1 slice multigrain bread', swap: 'carb_grain', kcal: 80, protein: 3 },
        { id: 'b8c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'Pan with 1 tsp olive oil, cook tofu till golden, add spinach last min.' },

    { id: 'b9', name: 'Italian frittata', cuisine: '🇮🇹', kcal: 450, protein: 30, carbs: 16, fat: 28,
      items: [
        { id: 'b9a', text: '3-egg frittata with zucchini, tomato, basil, feta', swap: 'protein_main', kcal: 360, protein: 26 },
        { id: 'b9b', text: '1 slice multigrain bread', swap: 'carb_grain', kcal: 80, protein: 3 },
        { id: 'b9c', text: 'Coffee or green tea', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'Whisk eggs, pan with 1 tsp olive oil, add veg, cook till set, finish under grill if available.' },

    { id: 'b10', name: 'Thai congee with eggs', cuisine: '🇹🇭', kcal: 400, protein: 24, carbs: 48, fat: 10,
      items: [
        { id: 'b10a', text: '½ cup rice congee with ginger + chicken stock', swap: 'carb_grain', kcal: 200, protein: 6 },
        { id: 'b10b', text: '2 soft-boiled eggs on top', swap: 'protein_main', kcal: 140, protein: 12 },
        { id: 'b10c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'Cook ½ cup rice with 3 cups water + ginger till porridge. Soft-boil eggs 6 min.' }
  ],

  midmorning: [
    { id: 'm1', name: 'Yogurt + walnuts + apple', cuisine: '🌍', kcal: 280, protein: 16, carbs: 28, fat: 12,
      items: [
        { id: 'm1a', text: '150g Greek yogurt', swap: 'protein_main', kcal: 150, protein: 14 },
        { id: 'm1b', text: '5 walnut halves', swap: null, kcal: 80, protein: 2 },
        { id: 'm1c', text: '1 small apple', swap: null, kcal: 50, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'm2', name: 'Hummus + veg sticks', cuisine: '🇦🇪', kcal: 240, protein: 10, carbs: 22, fat: 14,
      items: [
        { id: 'm2a', text: '3 tbsp hummus', swap: null, kcal: 140, protein: 6 },
        { id: 'm2b', text: 'Cucumber, carrot, bell pepper sticks', swap: 'veg_side', kcal: 50, protein: 2 },
        { id: 'm2c', text: '5 almonds', swap: null, kcal: 50, protein: 2 }
      ],
      helper: 'Hummus from supermarket. Cut veg sticks fresh.' },

    { id: 'm3', name: 'Boiled eggs + fruit', cuisine: '🌍', kcal: 220, protein: 14, carbs: 18, fat: 11,
      items: [
        { id: 'm3a', text: '2 boiled eggs', swap: 'protein_main', kcal: 140, protein: 12 },
        { id: 'm3b', text: 'Small pear or apple', swap: null, kcal: 60, protein: 0 },
        { id: 'm3c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'Boil eggs 8 min, store in fridge for 3 days.' },

    { id: 'm4', name: 'Cottage cheese bowl', cuisine: '🌍', kcal: 260, protein: 22, carbs: 16, fat: 12,
      items: [
        { id: 'm4a', text: '½ cup cottage cheese', swap: 'protein_main', kcal: 120, protein: 14 },
        { id: 'm4b', text: 'Handful berries', swap: null, kcal: 60, protein: 1 },
        { id: 'm4c', text: '5 almonds', swap: null, kcal: 50, protein: 2 }
      ],
      helper: 'No prep.' },

    { id: 'm5', name: 'Roasted chana', cuisine: '🇮🇳', kcal: 250, protein: 12, carbs: 32, fat: 8,
      items: [
        { id: 'm5a', text: '½ cup roasted chickpeas (lightly spiced)', swap: null, kcal: 180, protein: 10 },
        { id: 'm5b', text: '1 small apple', swap: null, kcal: 50, protein: 0 },
        { id: 'm5c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'Roast chickpeas in oven 200°C for 25 min with paprika + salt + 1 tsp olive oil. Stores 1 week.' },

    { id: 'm6', name: 'Protein smoothie', cuisine: '🌍', kcal: 270, protein: 26, carbs: 22, fat: 8,
      items: [
        { id: 'm6a', text: '1 scoop whey protein + water', swap: 'protein_main', kcal: 130, protein: 25 },
        { id: 'm6b', text: '½ banana', swap: null, kcal: 50, protein: 1 },
        { id: 'm6c', text: '1 tbsp peanut butter', swap: null, kcal: 90, protein: 4 }
      ],
      helper: 'Blend with ice.' },

    { id: 'm7', name: 'Labneh + cucumber', cuisine: '🇦🇪', kcal: 230, protein: 12, carbs: 8, fat: 16,
      items: [
        { id: 'm7a', text: '3 tbsp labneh + drizzle olive oil', swap: 'protein_main', kcal: 140, protein: 8 },
        { id: 'm7b', text: 'Cucumber slices + 5 olives', swap: 'veg_side', kcal: 40, protein: 2 },
        { id: 'm7c', text: '5 almonds', swap: null, kcal: 50, protein: 2 }
      ],
      helper: 'No prep.' },

    { id: 'm8', name: 'Edamame snack', cuisine: '🇯🇵', kcal: 220, protein: 18, carbs: 18, fat: 8,
      items: [
        { id: 'm8a', text: '1 cup shelled edamame with sea salt', swap: 'protein_main', kcal: 180, protein: 17 },
        { id: 'm8b', text: '1 small orange', swap: null, kcal: 40, protein: 1 }
      ],
      helper: 'Boil edamame 5 min, drain, salt.' },

    { id: 'm9', name: 'Smoked salmon roll', cuisine: '🌍', kcal: 260, protein: 22, carbs: 14, fat: 14,
      items: [
        { id: 'm9a', text: '50g smoked salmon', swap: 'protein_main', kcal: 90, protein: 14 },
        { id: 'm9b', text: '1 slice multigrain bread + cream cheese', swap: 'carb_grain', kcal: 130, protein: 6 },
        { id: 'm9c', text: 'Cucumber slices', swap: 'veg_side', kcal: 10, protein: 1 }
      ],
      helper: 'Assemble. No cook.' },

    { id: 'm10', name: 'Caprese mini', cuisine: '🇮🇹', kcal: 250, protein: 16, carbs: 8, fat: 18,
      items: [
        { id: 'm10a', text: '80g fresh mozzarella + tomato slices', swap: 'protein_main', kcal: 200, protein: 14 },
        { id: 'm10b', text: 'Basil leaves + drizzle olive oil', swap: 'veg_side', kcal: 40, protein: 1 },
        { id: 'm10c', text: '5 olives', swap: null, kcal: 25, protein: 0 }
      ],
      helper: 'Slice tomato and mozzarella, layer with basil, olive oil + balsamic.' }
  ],

  lunch: [
    { id: 'l1', name: 'Chicken tikka + roti + salad', cuisine: '🇮🇳', kcal: 510, protein: 44, carbs: 38, fat: 18,
      items: [
        { id: 'l1a', text: '150g oven-baked chicken tikka', swap: 'protein_main', kcal: 250, protein: 40 },
        { id: 'l1b', text: '1 multigrain roti', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'l1c', text: 'Large mixed salad + olive oil + lemon', swap: 'veg_side', kcal: 130, protein: 3 }
      ],
      helper: 'Tikka marinade: 1 tbsp yogurt + lemon + red chili + cumin + coriander + ginger-garlic. Bake at 200°C for 18 min on tray.' },

    { id: 'l2', name: 'Daal + brown rice + chicken', cuisine: '🇵🇰', kcal: 530, protein: 42, carbs: 56, fat: 12,
      items: [
        { id: 'l2a', text: '1 cup masoor daal (1 tsp oil tarka)', swap: null, kcal: 180, protein: 14 },
        { id: 'l2b', text: '½ cup brown rice', swap: 'carb_grain', kcal: 110, protein: 3 },
        { id: 'l2c', text: '100g shredded chicken', swap: 'protein_main', kcal: 160, protein: 24 },
        { id: 'l2d', text: 'Cucumber salad', swap: 'veg_side', kcal: 30, protein: 1 }
      ],
      helper: 'Daal: 1 tsp olive oil tarka with cumin seeds, no ghee. Chicken: boil + shred with salt + black pepper.' },

    { id: 'l3', name: 'Chicken karahi + cauli rice', cuisine: '🇵🇰', kcal: 490, protein: 46, carbs: 18, fat: 26,
      items: [
        { id: 'l3a', text: '150g chicken karahi (2 tsp oil max, no cream)', swap: 'protein_main', kcal: 320, protein: 42 },
        { id: 'l3b', text: '1 cup cauliflower rice', swap: 'carb_grain', kcal: 50, protein: 4 },
        { id: 'l3c', text: 'Cucumber raita', swap: 'veg_side', kcal: 70, protein: 4 }
      ],
      helper: 'Karahi: 2 tsp olive oil, onion + tomato + ginger-garlic + green chili + spices. No butter/cream. Cauli rice: grate cauliflower, dry-fry 5 min.' },

    { id: 'l4', name: 'Salmon + quinoa + greens', cuisine: '🌍', kcal: 520, protein: 38, carbs: 36, fat: 22,
      items: [
        { id: 'l4a', text: '150g pan-seared salmon', swap: 'protein_main', kcal: 290, protein: 35 },
        { id: 'l4b', text: '½ cup quinoa', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'l4c', text: 'Sautéed spinach + garlic', swap: 'veg_side', kcal: 80, protein: 3 }
      ],
      helper: 'Salmon: pan-sear skin-side down 4 min, flip 3 min. 1 tsp olive oil.' },

    { id: 'l5', name: 'Beef stir-fry + brown rice', cuisine: '🇨🇳', kcal: 510, protein: 40, carbs: 42, fat: 18,
      items: [
        { id: 'l5a', text: '120g lean beef strips stir-fried', swap: 'protein_main', kcal: 240, protein: 32 },
        { id: 'l5b', text: '⅓ cup brown rice', swap: 'carb_grain', kcal: 90, protein: 3 },
        { id: 'l5c', text: 'Broccoli + bok choy in soy-ginger', swap: 'veg_side', kcal: 80, protein: 5 }
      ],
      helper: 'High heat, 1 tsp sesame oil. Beef first 2 min, remove, then veg 3 min, combine. Low-sodium soy sauce.' },

    { id: 'l6', name: 'Lean chicken biryani', cuisine: '🇮🇳', kcal: 530, protein: 38, carbs: 58, fat: 14,
      items: [
        { id: 'l6a', text: '150g chicken cooked with biryani masala', swap: 'protein_main', kcal: 250, protein: 35 },
        { id: 'l6b', text: '½ cup brown rice (saffron-flavored)', swap: 'carb_grain', kcal: 110, protein: 3 },
        { id: 'l6c', text: 'Cucumber raita', swap: 'veg_side', kcal: 70, protein: 4 }
      ],
      helper: 'Cook chicken in pressure cooker with biryani masala + 1 tsp olive oil. Add cooked brown rice + saffron water. No ghee.' },

    { id: 'l7', name: 'Chickpea curry + roti', cuisine: '🇮🇳', kcal: 500, protein: 26, carbs: 62, fat: 16,
      items: [
        { id: 'l7a', text: '1 cup chana masala (no cream)', swap: null, kcal: 220, protein: 12 },
        { id: 'l7b', text: '1 multigrain roti', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'l7c', text: '100g shredded chicken or paneer', swap: 'protein_main', kcal: 170, protein: 18 }
      ],
      helper: 'Chana masala: 1 tsp oil, no cream, lots of tomato-onion. Add chicken or paneer separately.' },

    { id: 'l8', name: 'Falafel bowl', cuisine: '🇦🇪', kcal: 520, protein: 30, carbs: 50, fat: 22,
      items: [
        { id: 'l8a', text: '4 baked falafel patties', swap: 'protein_main', kcal: 250, protein: 14 },
        { id: 'l8b', text: '½ cup quinoa or brown rice', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'l8c', text: 'Tabbouleh + cucumber + tomato', swap: 'veg_side', kcal: 130, protein: 4 },
        { id: 'l8d', text: '2 tbsp hummus + tahini drizzle', swap: null, kcal: 100, protein: 5 }
      ],
      helper: 'Bake falafel from frozen 200°C 15 min OR make: blend chickpeas + onion + parsley + garlic + cumin, form patties, bake.' },

    { id: 'l9', name: 'Mediterranean fish + farro', cuisine: '🇬🇷', kcal: 510, protein: 40, carbs: 44, fat: 16,
      items: [
        { id: 'l9a', text: '150g pan-seared white fish (lemon, herbs)', swap: 'protein_main', kcal: 230, protein: 38 },
        { id: 'l9b', text: '½ cup farro or quinoa', swap: 'carb_grain', kcal: 120, protein: 5 },
        { id: 'l9c', text: 'Roasted vegetables + olives', swap: 'veg_side', kcal: 130, protein: 3 }
      ],
      helper: 'Fish: 1 tsp olive oil, lemon, salt, pan-sear 3 min each side. Roast veg 200°C 20 min.' },

    { id: 'l10', name: 'Thai chicken larb bowl', cuisine: '🇹🇭', kcal: 490, protein: 42, carbs: 36, fat: 18,
      items: [
        { id: 'l10a', text: '150g minced chicken with lime, fish sauce, mint, chili', swap: 'protein_main', kcal: 260, protein: 38 },
        { id: 'l10b', text: '⅓ cup brown rice', swap: 'carb_grain', kcal: 90, protein: 3 },
        { id: 'l10c', text: 'Lettuce cups + cucumber + herbs', swap: 'veg_side', kcal: 60, protein: 2 }
      ],
      helper: 'Cook chicken mince dry-fry, add lime juice, fish sauce, fresh mint, chili. Serve in lettuce cups with rice on side.' },

    { id: 'l11', name: 'Italian chicken + zoodles', cuisine: '🇮🇹', kcal: 480, protein: 44, carbs: 22, fat: 22,
      items: [
        { id: 'l11a', text: '150g chicken breast in tomato-basil sauce', swap: 'protein_main', kcal: 280, protein: 38 },
        { id: 'l11b', text: 'Spiralized zucchini noodles', swap: 'carb_grain', kcal: 40, protein: 3 },
        { id: 'l11c', text: 'Mixed leaves + parmesan + olive oil', swap: 'veg_side', kcal: 130, protein: 5 }
      ],
      helper: 'Pan-cook chicken, add crushed tomato + garlic + basil. Spiralize zucchini (or use peeler), brief sauté.' },

    { id: 'l12', name: 'Japanese teriyaki bowl (light)', cuisine: '🇯🇵', kcal: 510, protein: 38, carbs: 50, fat: 14,
      items: [
        { id: 'l12a', text: '150g chicken in low-sodium teriyaki (no sugar added)', swap: 'protein_main', kcal: 270, protein: 36 },
        { id: 'l12b', text: '½ cup brown rice', swap: 'carb_grain', kcal: 110, protein: 3 },
        { id: 'l12c', text: 'Steamed broccoli + sesame seeds', swap: 'veg_side', kcal: 90, protein: 5 }
      ],
      helper: 'Use low-sodium soy + ginger + garlic + tiny honey as teriyaki. Pan-cook chicken with sauce. Steam broccoli 4 min.' }
  ],

  preworkout: [
    { id: 'p1', name: 'Banana + coffee', cuisine: '🌍', kcal: 110, protein: 1, carbs: 26, fat: 0,
      items: [
        { id: 'p1a', text: '1 banana', swap: null, kcal: 105, protein: 1 },
        { id: 'p1b', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'No prep. 45 min before gym.' },

    { id: 'p2', name: 'Dates + coffee', cuisine: '🇦🇪', kcal: 100, protein: 1, carbs: 24, fat: 0,
      items: [
        { id: 'p2a', text: '3 medjool dates', swap: null, kcal: 90, protein: 1 },
        { id: 'p2b', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'p3', name: 'Apple + peanut butter', cuisine: '🌍', kcal: 180, protein: 5, carbs: 22, fat: 9,
      items: [
        { id: 'p3a', text: '1 small apple', swap: null, kcal: 80, protein: 0 },
        { id: 'p3b', text: '1 tbsp natural peanut butter', swap: null, kcal: 95, protein: 4 }
      ],
      helper: 'No prep.' },

    { id: 'p4', name: 'Rice cake + honey', cuisine: '🌍', kcal: 130, protein: 2, carbs: 28, fat: 1,
      items: [
        { id: 'p4a', text: '2 whole-grain rice cakes', swap: 'carb_grain', kcal: 90, protein: 2 },
        { id: 'p4b', text: '1 tsp honey', swap: null, kcal: 20, protein: 0 },
        { id: 'p4c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'p5', name: 'Banana + almonds', cuisine: '🌍', kcal: 150, protein: 3, carbs: 28, fat: 5,
      items: [
        { id: 'p5a', text: '1 banana', swap: null, kcal: 105, protein: 1 },
        { id: 'p5b', text: '5 almonds', swap: null, kcal: 35, protein: 2 },
        { id: 'p5c', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'p6', name: 'Dates + walnuts', cuisine: '🇦🇪', kcal: 160, protein: 3, carbs: 24, fat: 7,
      items: [
        { id: 'p6a', text: '2 dates', swap: null, kcal: 60, protein: 1 },
        { id: 'p6b', text: '4 walnut halves', swap: null, kcal: 80, protein: 2 },
        { id: 'p6c', text: 'Black coffee', swap: 'drink', kcal: 5, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'p7', name: 'Oat energy bites', cuisine: '🌍', kcal: 150, protein: 4, carbs: 22, fat: 6,
      items: [
        { id: 'p7a', text: '2 tbsp oats + 1 mashed date + 1 tsp peanut butter rolled', swap: 'carb_grain', kcal: 150, protein: 4 }
      ],
      helper: 'Mix, roll into balls, refrigerate. Prep batch weekly.' },

    { id: 'p8', name: 'Mochi bites + green tea', cuisine: '🇯🇵', kcal: 140, protein: 2, carbs: 30, fat: 1,
      items: [
        { id: 'p8a', text: '2 small mochi pieces (plain)', swap: null, kcal: 140, protein: 2 },
        { id: 'p8b', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'No prep.' }
  ],

  postworkout: [
    { id: 'po1', name: 'Whey shake', cuisine: '🌍', kcal: 130, protein: 25, carbs: 4, fat: 1,
      items: [
        { id: 'po1a', text: '1 scoop whey isolate + 250ml water', swap: 'protein_main', kcal: 130, protein: 25 }
      ],
      helper: 'Shake in bottle. Within 45 min of finishing workout.' },

    { id: 'po2', name: 'Yogurt + walnuts + honey', cuisine: '🌍', kcal: 240, protein: 18, carbs: 16, fat: 12,
      items: [
        { id: 'po2a', text: '150g Greek yogurt', swap: 'protein_main', kcal: 150, protein: 15 },
        { id: 'po2b', text: '5 walnut halves', swap: null, kcal: 80, protein: 2 },
        { id: 'po2c', text: '1 tsp honey', swap: null, kcal: 20, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'po3', name: 'Cottage cheese + berries', cuisine: '🌍', kcal: 200, protein: 22, carbs: 14, fat: 6,
      items: [
        { id: 'po3a', text: '½ cup cottage cheese', swap: 'protein_main', kcal: 120, protein: 14 },
        { id: 'po3b', text: 'Handful berries', swap: null, kcal: 60, protein: 1 },
        { id: 'po3c', text: 'Drizzle honey', swap: null, kcal: 20, protein: 0 }
      ],
      helper: 'No prep.' },

    { id: 'po4', name: 'Egg + banana', cuisine: '🌍', kcal: 220, protein: 14, carbs: 22, fat: 10,
      items: [
        { id: 'po4a', text: '2 boiled eggs', swap: 'protein_main', kcal: 140, protein: 12 },
        { id: 'po4b', text: '½ banana', swap: null, kcal: 50, protein: 1 }
      ],
      helper: 'Eggs from fridge.' },

    { id: 'po5', name: 'Tuna + cucumber', cuisine: '🌍', kcal: 180, protein: 26, carbs: 4, fat: 6,
      items: [
        { id: 'po5a', text: '1 small can tuna in water', swap: 'protein_main', kcal: 120, protein: 24 },
        { id: 'po5b', text: 'Cucumber slices + lemon', swap: 'veg_side', kcal: 20, protein: 1 }
      ],
      helper: 'Open, drain, season.' },

    { id: 'po6', name: 'Chicken bites + fruit', cuisine: '🌍', kcal: 200, protein: 24, carbs: 14, fat: 6,
      items: [
        { id: 'po6a', text: '80g cooked chicken pieces', swap: 'protein_main', kcal: 130, protein: 22 },
        { id: 'po6b', text: '1 small fruit', swap: null, kcal: 60, protein: 1 }
      ],
      helper: 'Pre-cooked chicken from lunch prep.' },

    { id: 'po7', name: 'Protein smoothie', cuisine: '🌍', kcal: 200, protein: 26, carbs: 16, fat: 3,
      items: [
        { id: 'po7a', text: '1 scoop whey + ½ banana + ice + water', swap: 'protein_main', kcal: 200, protein: 26 }
      ],
      helper: 'Blend.' },

    { id: 'po8', name: 'Edamame + boiled egg', cuisine: '🇯🇵', kcal: 230, protein: 22, carbs: 12, fat: 10,
      items: [
        { id: 'po8a', text: '½ cup shelled edamame', swap: 'protein_main', kcal: 100, protein: 9 },
        { id: 'po8b', text: '2 boiled eggs', swap: null, kcal: 130, protein: 12 }
      ],
      helper: 'Boil edamame 5 min.' }
  ],

  snack: [
    { id: 'sn1', name: 'Apple + peanut butter', cuisine: '🌍', kcal: 180, protein: 5, carbs: 22, fat: 9,
      items: [
        { id: 'sn1a', text: '1 small apple', swap: null, kcal: 80, protein: 0 },
        { id: 'sn1b', text: '1 tbsp peanut butter', swap: null, kcal: 95, protein: 4 }
      ],
      helper: 'No prep.' },

    { id: 'sn2', name: 'Greek yogurt + cinnamon', cuisine: '🇬🇷', kcal: 170, protein: 16, carbs: 12, fat: 6,
      items: [
        { id: 'sn2a', text: '150g Greek yogurt + cinnamon', swap: 'protein_main', kcal: 150, protein: 15 },
        { id: 'sn2b', text: 'Few raspberries', swap: null, kcal: 20, protein: 1 }
      ],
      helper: 'No prep.' },

    { id: 'sn3', name: 'Almonds + green tea', cuisine: '🌍', kcal: 165, protein: 6, carbs: 6, fat: 14,
      items: [
        { id: 'sn3a', text: '20 almonds', swap: null, kcal: 165, protein: 6 },
        { id: 'sn3b', text: 'Green tea', swap: 'drink', kcal: 0, protein: 0 }
      ],
      helper: 'No prep.' }
  ],

  dinner: [
    { id: 'd1', name: 'Pan-seared fish + sabzi', cuisine: '🇮🇳', kcal: 470, protein: 42, carbs: 18, fat: 26,
      items: [
        { id: 'd1a', text: '150g pan-seared white fish', swap: 'protein_main', kcal: 230, protein: 38 },
        { id: 'd1b', text: 'Zucchini-onion sabzi (1 tsp oil)', swap: 'veg_side', kcal: 130, protein: 3 },
        { id: 'd1c', text: 'Cucumber-tomato salad', swap: 'veg_side', kcal: 45, protein: 1 }
      ],
      helper: 'Fish: pan-sear 1 tsp olive oil, 3 min each side. Sabzi: sauté veg with cumin + turmeric.' },

    { id: 'd2', name: 'Chicken karahi + salad', cuisine: '🇵🇰', kcal: 480, protein: 44, carbs: 14, fat: 26,
      items: [
        { id: 'd2a', text: '150g chicken karahi (2 tsp oil, no cream)', swap: 'protein_main', kcal: 320, protein: 42 },
        { id: 'd2b', text: 'Large mixed salad', swap: 'veg_side', kcal: 130, protein: 3 }
      ],
      helper: '2 tsp olive oil, onion + tomato + spices. No carb at dinner.' },

    { id: 'd3', name: 'Daal soup + chicken', cuisine: '🇮🇳', kcal: 460, protein: 38, carbs: 32, fat: 14,
      items: [
        { id: 'd3a', text: '1 bowl masoor daal (soupy)', swap: null, kcal: 200, protein: 14 },
        { id: 'd3b', text: '120g shredded chicken', swap: 'protein_main', kcal: 200, protein: 26 },
        { id: 'd3c', text: 'Steamed greens', swap: 'veg_side', kcal: 60, protein: 3 }
      ],
      helper: 'Daal thinned to soup consistency. Chicken boiled + shredded.' },

    { id: 'd4', name: 'Egg + paneer scramble', cuisine: '🇮🇳', kcal: 470, protein: 32, carbs: 14, fat: 28,
      items: [
        { id: 'd4a', text: '2 eggs + 60g paneer scrambled with spinach, onion, turmeric', swap: 'protein_main', kcal: 380, protein: 28 },
        { id: 'd4b', text: 'Large salad', swap: 'veg_side', kcal: 90, protein: 4 }
      ],
      helper: '1 tsp olive oil. Pan-scramble. No carb at dinner.' },

    { id: 'd5', name: 'Beef + greens stir-fry', cuisine: '🇨🇳', kcal: 480, protein: 40, carbs: 16, fat: 24,
      items: [
        { id: 'd5a', text: '120g lean beef stir-fried with garlic, ginger', swap: 'protein_main', kcal: 280, protein: 34 },
        { id: 'd5b', text: 'Broccoli + bok choy', swap: 'veg_side', kcal: 100, protein: 5 },
        { id: 'd5c', text: 'Cucumber-sesame salad', swap: 'veg_side', kcal: 100, protein: 1 }
      ],
      helper: '1 tsp sesame oil, high heat, quick stir-fry. No rice at dinner.' },

    { id: 'd6', name: 'Oven-baked chicken + sweet potato', cuisine: '🌍', kcal: 490, protein: 44, carbs: 32, fat: 16,
      items: [
        { id: 'd6a', text: '150g oven-baked chicken with lemon-garlic-herbs', swap: 'protein_main', kcal: 270, protein: 38 },
        { id: 'd6b', text: 'Small baked sweet potato', swap: 'carb_grain', kcal: 110, protein: 2 },
        { id: 'd6c', text: 'Steamed greens', swap: 'veg_side', kcal: 110, protein: 4 }
      ],
      helper: 'Marinate chicken with lemon-garlic-herbs. Bake at 200°C 22 min. Sweet potato wrapped in foil, bake same time.' },

    { id: 'd7', name: 'Tandoori chicken + salad + raita', cuisine: '🇮🇳', kcal: 470, protein: 46, carbs: 12, fat: 22,
      items: [
        { id: 'd7a', text: '150g oven-baked tandoori chicken', swap: 'protein_main', kcal: 280, protein: 40 },
        { id: 'd7b', text: 'Large salad with lemon-olive oil', swap: 'veg_side', kcal: 120, protein: 3 },
        { id: 'd7c', text: 'Cucumber raita', swap: 'veg_side', kcal: 70, protein: 3 }
      ],
      helper: 'Tandoori paste + yogurt + lemon marinade. Oven 220°C 18-20 min.' },

    { id: 'd8', name: 'Greek chicken souvlaki + greens', cuisine: '🇬🇷', kcal: 490, protein: 44, carbs: 18, fat: 26,
      items: [
        { id: 'd8a', text: '150g oven-baked chicken souvlaki (oregano, lemon, garlic)', swap: 'protein_main', kcal: 280, protein: 40 },
        { id: 'd8b', text: 'Greek salad (cucumber, tomato, feta, olives)', swap: 'veg_side', kcal: 170, protein: 4 },
        { id: 'd8c', text: 'Tzatziki (yogurt-cucumber)', swap: null, kcal: 40, protein: 2 }
      ],
      helper: 'Marinate chicken cubes in oregano, lemon, garlic, olive oil. Bake or pan-cook 15 min.' },

    { id: 'd9', name: 'Italian baked fish + ratatouille', cuisine: '🇮🇹', kcal: 460, protein: 42, carbs: 24, fat: 18,
      items: [
        { id: 'd9a', text: '150g baked white fish (lemon, parsley, garlic)', swap: 'protein_main', kcal: 230, protein: 38 },
        { id: 'd9b', text: 'Ratatouille (tomato, zucchini, eggplant, pepper)', swap: 'veg_side', kcal: 180, protein: 3 },
        { id: 'd9c', text: 'Mixed leaves with olive oil', swap: 'veg_side', kcal: 50, protein: 1 }
      ],
      helper: 'Fish in foil with lemon and herbs, oven 200°C 15 min. Ratatouille: dice veg, slow-cook with garlic in 1 tbsp olive oil 30 min.' },

    { id: 'd10', name: 'Thai green curry chicken', cuisine: '🇹🇭', kcal: 480, protein: 40, carbs: 20, fat: 26,
      items: [
        { id: 'd10a', text: '150g chicken in light green curry (less coconut milk)', swap: 'protein_main', kcal: 320, protein: 38 },
        { id: 'd10b', text: 'Steamed bok choy + bean sprouts', swap: 'veg_side', kcal: 60, protein: 4 },
        { id: 'd10c', text: 'Small cauliflower rice', swap: 'carb_grain', kcal: 50, protein: 4 }
      ],
      helper: 'Light coconut milk + green curry paste + chicken. Simmer 15 min. Cauli rice on side.' },

    { id: 'd11', name: 'Japanese miso salmon + veg', cuisine: '🇯🇵', kcal: 470, protein: 38, carbs: 18, fat: 24,
      items: [
        { id: 'd11a', text: '150g salmon glazed with miso (less sugar)', swap: 'protein_main', kcal: 320, protein: 35 },
        { id: 'd11b', text: 'Steamed broccoli + sesame', swap: 'veg_side', kcal: 90, protein: 5 },
        { id: 'd11c', text: 'Cucumber-seaweed salad', swap: 'veg_side', kcal: 50, protein: 2 }
      ],
      helper: 'Miso + tiny mirin + ginger glaze. Brush on salmon, oven 200°C 12 min. Sesame on top.' },

    { id: 'd12', name: 'Mediterranean chicken + cauli mash', cuisine: '🇬🇷', kcal: 470, protein: 46, carbs: 16, fat: 22,
      items: [
        { id: 'd12a', text: '150g pan-cooked chicken with sun-dried tomato, olives, basil', swap: 'protein_main', kcal: 290, protein: 40 },
        { id: 'd12b', text: 'Cauliflower mash (with garlic)', swap: 'carb_grain', kcal: 110, protein: 4 },
        { id: 'd12c', text: 'Sautéed spinach', swap: 'veg_side', kcal: 70, protein: 3 }
      ],
      helper: 'Pan chicken with olive oil, garlic, sun-dried tomato, olives. Steam cauli + blend with garlic.' }
  ]
};

// ===== EXERCISE LIBRARY (expanded with sets/reps/weight/rest) =====
// Phase 0/1/2 weights auto-adjust. User can override with actual lifted weight.
const EXERCISES = {
  // ===== MOBILITY / WARM-UP =====
  cat_cow: { name: 'Cat-Cow', cat: 'mobility', sets: 1, reps: '10 slow', weight: 'bodyweight', rest: 0, cue: 'Arch back up, sag belly down, move with breath', video: 'cat cow stretch beginner tutorial' },
  childs_pose: { name: "Child's Pose", cat: 'mobility', sets: 1, reps: 'Hold 45 sec', weight: 'bodyweight', rest: 0, cue: 'Knees wide, sit back on heels, arms forward', video: 'childs pose yoga stretch' },
  hip_flexor_stretch: { name: 'Kneeling Hip Flexor Stretch', cat: 'mobility', sets: 2, reps: '45 sec each side', weight: 'bodyweight', rest: 0, cue: 'Push hips forward gently, hold', video: 'kneeling hip flexor stretch' },
  piriformis_stretch: { name: 'Seated Piriformis Stretch', cat: 'mobility', sets: 2, reps: '45 sec each side', weight: 'bodyweight', rest: 0, cue: 'Cross ankle over knee, lean forward', video: 'seated piriformis stretch' },
  wall_angels: { name: 'Wall Angels', cat: 'mobility', sets: 2, reps: '10 reps', weight: 'bodyweight', rest: 30, cue: 'Back to wall, slide arms up and down in W to Y', video: 'wall angels posture exercise' },
  cobra_stretch: { name: 'Cobra Stretch', cat: 'mobility', sets: 2, reps: 'Hold 30 sec', weight: 'bodyweight', rest: 15, cue: 'Lie face down, push chest up, hips on floor', video: 'cobra pose stretch beginner' },
  thoracic_rotation: { name: 'Thoracic Spine Rotation', cat: 'mobility', sets: 2, reps: '10 each side', weight: 'bodyweight', rest: 30, cue: 'On all fours, rotate one arm to ceiling', video: 'thoracic spine rotation exercise' },
  worlds_greatest_stretch: { name: "World's Greatest Stretch", cat: 'mobility', sets: 2, reps: '5 each side', weight: 'bodyweight', rest: 30, cue: 'Lunge, hand to floor, twist arm up', video: 'worlds greatest stretch tutorial' },
  forward_fold: { name: 'Standing Forward Fold', cat: 'mobility', sets: 1, reps: 'Hold 45 sec', weight: 'bodyweight', rest: 0, cue: 'Hinge at hips, let arms hang heavy', video: 'standing forward fold stretch' },
  figure4: { name: 'Figure-4 Stretch (lying)', cat: 'mobility', sets: 2, reps: '45 sec each side', weight: 'bodyweight', rest: 0, cue: 'On back, ankle on opposite knee, pull thigh in', video: 'figure 4 stretch lying down' },

  // ===== ACTIVATION / CORE =====
  glute_bridge: { name: 'Glute Bridge', cat: 'core', sets: 3, reps: 15, weight: 'bodyweight', rest: 45, cue: 'Squeeze glutes, hold 2 sec at top', video: 'glute bridge proper form' },
  single_leg_glute_bridge: { name: 'Single-Leg Glute Bridge', cat: 'core', sets: 3, reps: '10 each side', weight: 'bodyweight', rest: 45, cue: 'One leg extended, push through heel', video: 'single leg glute bridge tutorial' },
  hip_thrust: { name: 'Barbell Hip Thrust', cat: 'glutes', sets: 3, reps: 12, weight: '20kg', rest: 90, cue: 'Shoulders on bench, barbell over hips, drive up', video: 'barbell hip thrust proper form' },
  db_hip_thrust: { name: 'DB Hip Thrust', cat: 'glutes', sets: 3, reps: 12, weight: '10kg', rest: 60, cue: 'Hold dumbbell on hips, squeeze glutes up', video: 'dumbbell hip thrust' },
  dead_bug: { name: 'Dead Bug', cat: 'core', sets: 3, reps: '10 each side', weight: 'bodyweight', rest: 30, cue: 'Opposite arm + leg, lower back stays flat', video: 'dead bug exercise tutorial' },
  bird_dog: { name: 'Bird Dog', cat: 'core', sets: 3, reps: '10 each side', weight: 'bodyweight', rest: 30, cue: 'Slow and controlled, opposite arm and leg', video: 'bird dog exercise tutorial' },
  plank: { name: 'Plank', cat: 'core', sets: 3, reps: '30-45 sec', weight: 'bodyweight', rest: 45, cue: 'Forearms down, body straight, breathe', video: 'how to do a proper plank' },
  side_plank: { name: 'Side Plank', cat: 'core', sets: 2, reps: '20-30 sec each side', weight: 'bodyweight', rest: 30, cue: 'Stack feet, hips up, body straight line', video: 'side plank proper form' },
  pallof_press: { name: 'Pallof Press', cat: 'core', sets: 3, reps: '10 each side', weight: '5kg cable', rest: 45, cue: 'Anti-rotation, press cable straight out', video: 'pallof press exercise' },
  cable_woodchop: { name: 'Cable Woodchop', cat: 'core', sets: 3, reps: '10 each side', weight: '10kg cable', rest: 45, cue: 'Rotational, hips and shoulders together', video: 'cable woodchop exercise' },
  hanging_knee_raise: { name: 'Hanging Knee Raise', cat: 'core', sets: 3, reps: 10, weight: 'bodyweight', rest: 60, cue: 'Hang from bar, knees up to chest, slow', video: 'hanging knee raise tutorial' },
  hollow_hold: { name: 'Hollow Hold', cat: 'core', sets: 3, reps: '20-30 sec', weight: 'bodyweight', rest: 45, cue: 'Lower back pressed down, arms and legs hover', video: 'hollow body hold tutorial' },

  // ===== LOWER BODY =====
  bodyweight_squat: { name: 'Bodyweight Squat', cat: 'legs', sets: 3, reps: 15, weight: 'bodyweight', rest: 45, cue: 'Sit back like into chair, knees track over toes', video: 'bodyweight squat proper form' },
  goblet_squat: { name: 'Goblet Squat', cat: 'legs', sets: 3, reps: 12, weight: '8kg', rest: 60, cue: 'Hold dumbbell at chest, full depth', video: 'goblet squat tutorial' },
  db_squat: { name: 'DB Squat', cat: 'legs', sets: 3, reps: 10, weight: '10kg each', rest: 75, cue: 'Dumbbells at sides, controlled descent', video: 'dumbbell squat proper form' },
  barbell_squat: { name: 'Barbell Back Squat', cat: 'legs', sets: 4, reps: 8, weight: '20kg', rest: 120, cue: 'Bar on traps, brace core, sit back', video: 'barbell squat beginner form' },
  reverse_lunge: { name: 'Reverse Lunge', cat: 'legs', sets: 3, reps: '10 each leg', weight: 'bodyweight', rest: 45, cue: 'Step back, lower knee, push through front heel', video: 'reverse lunge tutorial' },
  walking_lunge: { name: 'Walking Lunge', cat: 'legs', sets: 3, reps: '10 each leg', weight: '5kg each', rest: 60, cue: 'Step forward, alternate, knee tracks over toe', video: 'walking lunge proper form' },
  bulgarian_split_squat: { name: 'Bulgarian Split Squat', cat: 'legs', sets: 3, reps: '8 each leg', weight: '5kg each', rest: 60, cue: 'Rear foot on bench, lower front knee', video: 'bulgarian split squat tutorial' },
  step_up: { name: 'Step-Up', cat: 'legs', sets: 3, reps: '10 each leg', weight: '5kg each', rest: 45, cue: 'Step up onto bench, drive through heel', video: 'step up exercise dumbbell' },
  romanian_deadlift: { name: 'Romanian Deadlift (light)', cat: 'legs', sets: 3, reps: 10, weight: '10kg each', rest: 75, cue: 'Hinge at hips, neutral spine, hamstring stretch', video: 'romanian deadlift beginner form' },
  hip_abduction: { name: 'Hip Abduction Machine', cat: 'glutes', sets: 3, reps: 15, weight: '20kg', rest: 45, cue: 'Push knees out against pad, squeeze glutes', video: 'hip abduction machine' },
  hip_adduction: { name: 'Hip Adduction Machine', cat: 'legs', sets: 3, reps: 15, weight: '20kg', rest: 45, cue: 'Squeeze knees together, controlled', video: 'hip adduction machine' },
  leg_curl: { name: 'Lying Leg Curl', cat: 'legs', sets: 3, reps: 12, weight: '15kg', rest: 60, cue: 'Curl heels to glutes, slow eccentric', video: 'lying leg curl machine' },
  leg_press: { name: 'Leg Press (cautious — sciatica)', cat: 'legs', sets: 3, reps: 12, weight: '40kg', rest: 75, cue: 'Knees track in line, don\'t round lower back', video: 'leg press machine beginner' },
  calf_raise: { name: 'Standing Calf Raise', cat: 'legs', sets: 3, reps: 20, weight: 'bodyweight', rest: 30, cue: 'Up on toes, hold 1 sec at top', video: 'standing calf raise exercise' },
  clamshell: { name: 'Clamshells (band optional)', cat: 'glutes', sets: 3, reps: '15 each side', weight: 'bodyweight or band', rest: 30, cue: 'Lie on side, knees bent, lift top knee, hips still', video: 'clamshell exercise glutes' },
  glute_kickback: { name: 'Cable Glute Kickback', cat: 'glutes', sets: 3, reps: '12 each leg', weight: '5kg cable', rest: 45, cue: 'Cable on ankle, kick back, squeeze glute', video: 'cable glute kickback' },

  // ===== UPPER PUSH =====
  incline_db_press: { name: 'Incline DB Bench Press', cat: 'push', sets: 3, reps: 10, weight: '8kg each', rest: 90, cue: '30-45° bench, control down, press up', video: 'incline dumbbell bench press' },
  flat_db_press: { name: 'Flat DB Bench Press', cat: 'push', sets: 3, reps: 10, weight: '10kg each', rest: 90, cue: 'Lower DBs to mid-chest, press up', video: 'flat dumbbell bench press' },
  hammer_strength_press: { name: 'Hammer Machine Chest Press', cat: 'push', sets: 3, reps: 10, weight: '15kg each', rest: 75, cue: 'Seated, press handles forward', video: 'hammer strength chest press' },
  push_up: { name: 'Push-Up', cat: 'push', sets: 3, reps: '8-12', weight: 'bodyweight', rest: 60, cue: 'Chest to floor, full extension', video: 'pushup proper form beginner' },
  incline_pushup: { name: 'Incline Push-Up', cat: 'push', sets: 3, reps: 10, weight: 'bodyweight', rest: 45, cue: 'Hands on bench/bar, body straight', video: 'incline push up beginner' },
  shoulder_press: { name: 'Standing DB Shoulder Press', cat: 'push', sets: 3, reps: 10, weight: '5kg each', rest: 75, cue: 'Standing, brace core, press overhead', video: 'standing dumbbell shoulder press' },
  arnold_press: { name: 'Arnold Press', cat: 'push', sets: 3, reps: 10, weight: '5kg each', rest: 75, cue: 'Rotate palms as you press up', video: 'arnold press tutorial' },
  lateral_raise: { name: 'DB Lateral Raise', cat: 'push', sets: 3, reps: 12, weight: '4kg each', rest: 45, cue: 'Slight bend, lift to shoulder height', video: 'dumbbell lateral raise' },
  front_raise: { name: 'DB Front Raise', cat: 'push', sets: 3, reps: 12, weight: '4kg each', rest: 45, cue: 'Lift in front to shoulder height', video: 'dumbbell front raise' },
  tricep_pushdown: { name: 'Cable Tricep Pushdown', cat: 'push', sets: 3, reps: 12, weight: '15kg', rest: 45, cue: 'Elbows tucked, full extension', video: 'cable tricep pushdown' },
  overhead_tricep_ext: { name: 'Overhead Tricep Extension', cat: 'push', sets: 3, reps: 12, weight: '6kg', rest: 45, cue: 'Both hands on dumbbell, lower behind head', video: 'overhead tricep extension dumbbell' },
  dip: { name: 'Assisted Dip (machine)', cat: 'push', sets: 3, reps: 8, weight: 'assisted', rest: 75, cue: 'Lower until upper arms parallel, press up', video: 'assisted dip machine tutorial' },

  // ===== UPPER PULL =====
  lat_pulldown: { name: 'Lat Pulldown (wide)', cat: 'pull', sets: 3, reps: 12, weight: '20kg', rest: 60, cue: 'Pull to upper chest, squeeze lats', video: 'lat pulldown proper form' },
  close_grip_pulldown: { name: 'Close-Grip Pulldown', cat: 'pull', sets: 3, reps: 12, weight: '20kg', rest: 60, cue: 'V-handle, pull to lower chest', video: 'close grip lat pulldown' },
  db_row: { name: 'Single-Arm DB Row', cat: 'pull', sets: 3, reps: '10 each arm', weight: '8kg', rest: 60, cue: 'Brace on bench, row to hip', video: 'single arm dumbbell row' },
  standing_cable_row: { name: 'Standing Cable Row', cat: 'pull', sets: 3, reps: 12, weight: '15kg', rest: 60, cue: 'Stand facing machine, pull to belly', video: 'standing cable row tutorial' },
  seated_row_supported: { name: 'Seated Row (supported)', cat: 'pull', sets: 3, reps: 12, weight: '20kg', rest: 60, cue: 'Chest against pad if available', video: 'seated cable row proper form' },
  face_pull: { name: 'Cable Face Pull', cat: 'pull', sets: 3, reps: 15, weight: '8kg', rest: 45, cue: 'Pull rope to face, elbows high, squeeze rear delts', video: 'cable face pull tutorial' },
  reverse_fly: { name: 'DB Reverse Fly', cat: 'pull', sets: 3, reps: 12, weight: '4kg each', rest: 45, cue: 'Bend forward, raise DBs out to sides', video: 'dumbbell reverse fly' },
  bicep_curl: { name: 'DB Bicep Curl', cat: 'pull', sets: 3, reps: 12, weight: '5kg each', rest: 45, cue: 'Elbows pinned, controlled', video: 'dumbbell bicep curl proper form' },
  hammer_curl: { name: 'DB Hammer Curl', cat: 'pull', sets: 3, reps: 12, weight: '5kg each', rest: 45, cue: 'Palms face each other throughout', video: 'hammer curl dumbbell' },
  cable_curl: { name: 'Cable Bicep Curl', cat: 'pull', sets: 3, reps: 12, weight: '10kg', rest: 45, cue: 'Constant tension throughout range', video: 'cable bicep curl tutorial' },
  dead_hang: { name: 'Dead Hang', cat: 'pull', sets: 3, reps: '20-30 sec', weight: 'bodyweight', rest: 60, cue: 'Hang from bar, relax shoulders', video: 'dead hang exercise benefits' },
  assisted_pullup: { name: 'Assisted Pull-Up', cat: 'pull', sets: 3, reps: '6-8', weight: 'assisted', rest: 90, cue: 'Full extension, chin over bar', video: 'assisted pull up machine tutorial' },

  // ===== CARDIO =====
  treadmill_walk: { name: 'Treadmill Walk (warm-up)', cat: 'cardio', sets: 1, reps: '5 min', weight: '5 km/h, 2% incline', rest: 0, cue: 'Steady pace, get blood flowing', video: null },
  incline_walk: { name: 'Incline Walk', cat: 'cardio', sets: 1, reps: '15-20 min', weight: '5.5 km/h, 5-7% incline', rest: 0, cue: 'Brisk, slight sweat, can talk not sing', video: null },
  stationary_bike: { name: 'Stationary Bike', cat: 'cardio', sets: 1, reps: '15-25 min', weight: 'moderate resistance', rest: 0, cue: '80-90 RPM, steady', video: null },
  elliptical: { name: 'Elliptical', cat: 'cardio', sets: 1, reps: '15-20 min', weight: 'moderate', rest: 0, cue: 'Use arms, steady pace', video: null },
  rowing: { name: 'Rowing Machine', cat: 'cardio', sets: 1, reps: '10-15 min', weight: 'damper 4-6', rest: 0, cue: 'Legs first, then back, then arms', video: 'rowing machine proper form' },
  hiit_bike: { name: 'HIIT — Bike Intervals', cat: 'cardio', sets: 8, reps: '30 sec on / 60 sec off', weight: 'high resistance', rest: 60, cue: '30 sec hard, 60 sec easy spin', video: null },
  hiit_rower: { name: 'HIIT — Row Intervals', cat: 'cardio', sets: 6, reps: '250m fast / 60s rest', weight: '', rest: 60, cue: '250m sprint, full rest', video: null },

  // ===== RECOVERY =====
  foam_roll: { name: 'Foam Roller — Full Body', cat: 'recovery', sets: 1, reps: '8-10 min', weight: '', rest: 0, cue: 'Roll quads, glutes, IT band, back, calves', video: 'foam roller routine beginner' },
  sauna: { name: 'Sauna', cat: 'recovery', sets: 1, reps: '8-12 min', weight: '', rest: 0, cue: 'Hydrate before and after', video: null },
  steam: { name: 'Steam Room', cat: 'recovery', sets: 1, reps: '5-10 min', weight: '', rest: 0, cue: 'Breathe deep, relax', video: null },
  cold_shower: { name: 'Cold Shower', cat: 'recovery', sets: 1, reps: '30 sec - 2 min', weight: '', rest: 0, cue: 'After sauna for contrast', video: null }
};

// ===== EXERCISE POOLS PER DAY TYPE =====
// Full list of exercises that fit each day. User picks/swaps from here.
const EXERCISE_POOLS = {
  legs: ['treadmill_walk','cat_cow','hip_flexor_stretch','glute_bridge','single_leg_glute_bridge','bodyweight_squat','goblet_squat','db_squat','barbell_squat','reverse_lunge','walking_lunge','bulgarian_split_squat','step_up','romanian_deadlift','hip_abduction','hip_adduction','leg_curl','leg_press','hip_thrust','db_hip_thrust','clamshell','glute_kickback','calf_raise','plank','figure4','incline_walk','foam_roll'],
  push: ['treadmill_walk','cat_cow','wall_angels','thoracic_rotation','incline_db_press','flat_db_press','hammer_strength_press','push_up','incline_pushup','shoulder_press','arnold_press','lateral_raise','front_raise','tricep_pushdown','overhead_tricep_ext','dip','plank','side_plank','foam_roll'],
  mobility: ['treadmill_walk','foam_roll','cat_cow','childs_pose','cobra_stretch','hip_flexor_stretch','piriformis_stretch','thoracic_rotation','worlds_greatest_stretch','wall_angels','glute_bridge','dead_bug','bird_dog','figure4','forward_fold','incline_walk','stationary_bike'],
  pull: ['treadmill_walk','cat_cow','wall_angels','lat_pulldown','close_grip_pulldown','db_row','standing_cable_row','seated_row_supported','face_pull','reverse_fly','bicep_curl','hammer_curl','cable_curl','dead_hang','assisted_pullup','plank','foam_roll'],
  fullbody_hiit: ['treadmill_walk','cat_cow','glute_bridge','goblet_squat','db_squat','romanian_deadlift','flat_db_press','db_row','shoulder_press','plank','hiit_bike','hiit_rower','stationary_bike','foam_roll'],
  rest: ['incline_walk','foam_roll','cat_cow','childs_pose','forward_fold','figure4','piriformis_stretch']
};

// ===== DEFAULT DAILY WORKOUTS (auto-selected from pool) =====
const DEFAULT_WORKOUTS = {
  legs: ['treadmill_walk','glute_bridge','hip_flexor_stretch','goblet_squat','reverse_lunge','romanian_deadlift','step_up','hip_thrust','hip_abduction','leg_curl','calf_raise','plank','figure4','incline_walk'],
  push: ['treadmill_walk','wall_angels','cat_cow','incline_db_press','shoulder_press','lateral_raise','incline_pushup','tricep_pushdown','plank','side_plank','foam_roll'],
  mobility: ['treadmill_walk','foam_roll','cat_cow','childs_pose','hip_flexor_stretch','piriformis_stretch','glute_bridge','dead_bug','bird_dog','wall_angels','figure4','incline_walk','forward_fold'],
  pull: ['treadmill_walk','cat_cow','wall_angels','lat_pulldown','db_row','standing_cable_row','face_pull','bicep_curl','dead_hang','plank','foam_roll'],
  fullbody_hiit: ['treadmill_walk','cat_cow','glute_bridge','goblet_squat','flat_db_press','db_row','shoulder_press','romanian_deadlift','plank','hiit_bike','foam_roll'],
  rest: ['incline_walk','forward_fold','figure4']
};

// ===== WORKOUT TYPES =====
const WORKOUT_SPLITS = {
  legs: { id: 'legs', name: 'Lower Body & Glutes', icon: '🦵', focus: 'Strength · stability · symmetry' },
  push: { id: 'push', name: 'Upper Push', icon: '💪', focus: 'Chest · shoulders · triceps' },
  mobility: { id: 'mobility', name: 'Mobility & Recovery', icon: '🧘', focus: 'Active recovery · stretching · light cardio' },
  pull: { id: 'pull', name: 'Upper Pull', icon: '🎯', focus: 'Back · biceps · posture' },
  fullbody_hiit: { id: 'fullbody_hiit', name: 'Full Body + HIIT', icon: '🔥', focus: 'Compound lifts · metabolic conditioning' },
  class: {
    id: 'class', name: 'Group Class', icon: '🎵', focus: 'Instructor-led variety',
    classOptions: ['Cycling / My Ride','Rhythm n Ride','Brazil Butt Blast','Flow Yoga','Core (skip sit-ups & Russian twists)','Belly Dance','Fusion','TUFF (advanced)','RUSH Total Body (advanced)','Body Combat (advanced)','Other (type in)']
  },
  rest: { id: 'rest', name: 'Rest Day', icon: '😌', focus: 'Recovery · 20-30 min walk only' }
};

const DEFAULT_WEEKLY_SCHEDULE = ['rest','legs','push','mobility','pull','class','fullbody_hiit'];

function getDefaultWorkoutForDate(date) {
  return DEFAULT_WEEKLY_SCHEDULE[date.getDay()];
}

// ===== HABITS =====
const HABITS_PLAN = [
  { id: 'h1', title: 'Morning weight log', meta: 'Same time, before food' },
  { id: 'h5', title: 'Cut out fried food and sugary drinks', meta: 'Soft drinks, juice, fried' },
  { id: 'h6', title: 'Morning mobility (10 min)', meta: 'Hip flexor + glute bridge + dead bug' },
  { id: 'h7', title: '7+ hours sleep', meta: 'Recovery happens here' },
  { id: 'h8', title: '7,000+ steps', meta: 'Daily walking target' },
  { id: 'h9', title: 'Caffeine before 4:30pm only', meta: 'Sleep quality protection' }
];

// ===== PHASES (generic language) =====
const PHASES = [
  { name: 'Foundation', icon: '🌱', dayStart: 1, dayEnd: 21, description: 'Build mobility, learn movements, wake the body up.' },
  { name: 'Build', icon: '🏗', dayStart: 22, dayEnd: 49, description: 'Add weight, focus on form, progressive intensity.' },
  { name: 'Push', icon: '🔥', dayStart: 50, dayEnd: 87, description: 'Progressive overload. Compound lifts, faster pace.' }
];

function getCurrentPhase(date) {
  const dayNum = dayNumber(date);
  return PHASES.find(p => dayNum >= p.dayStart && dayNum <= p.dayEnd) || PHASES[2];
}

// ===== CHECKPOINTS (generic) =====
const CHECKPOINTS = [
  { week: 4, date: '2026-06-22', title: 'Week 4 Re-assessment', tasks: ['Body composition check (InBody or measurements)','Compare weight progress vs target','Take photos','Review what\'s working / not','Adjust plan for next 4 weeks'] },
  { week: 8, date: '2026-07-20', title: 'Week 8 Mid-point', tasks: ['Body composition check','Photos','Compare to start','Recalibrate calorie/protein targets if needed'] },
  { week: 12, date: '2026-08-17', title: 'Week 12 Final Assessment', tasks: ['Final body composition','Final photos vs Day 1','Total weight delta','Plan next 12-week cycle','Celebrate the win'] }
];

// ===== DAY UTILITIES =====
function dateKey(d) {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
}

function dayNumber(d) {
  const start = new Date(START_DATE);
  start.setHours(0, 0, 0, 0);
  const diff = Math.round((d - start) / 86400000);
  return Math.max(1, diff + 1);
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function shortDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(targetDateStr) {
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}
