import type { Product } from "../types";

/**
 * Store product catalogue — mirrors the items on the Subway UK allergen
 * information sheet (May 2026, standard/non-halal menu).
 *
 * unit: "kg" for anything weighed for wastage, "ea" for anything counted
 * as whole items/pieces.
 */
export const PRODUCTS: Product[] = [
  // Bread
  { id: "bread-italian-white", name: "Italian White Bread", category: "Bread", unit: "ea" },
  { id: "bread-wholegrain", name: "Wholegrain Bread", category: "Bread", unit: "ea" },
  { id: "bread-hearty-italian", name: "Hearty Italian Bread", category: "Bread", unit: "ea" },
  { id: "bread-italian-herb-cheese", name: "Italian Herb & Cheese Bread", category: "Bread", unit: "ea" },
  { id: "bread-honey-oat", name: "Honey & Oat Bread", category: "Bread", unit: "ea" },
  { id: "bread-jalapeno-cheese", name: "Jalapeño Cheese Bread", category: "Bread", unit: "ea" },
  { id: "bread-stuffing-topped", name: "Stuffing Topped Bread", category: "Bread", unit: "ea" },
  { id: "bread-gluten-free", name: "Gluten-Free Bread", category: "Bread", unit: "ea" },
  { id: "bread-plain-tortilla-wrap", name: "Plain Tortilla Wrap", category: "Bread", unit: "ea" },
  { id: "bread-sourdough-bun", name: "Sourdough Bun", category: "Bread", unit: "ea" },

  // Meat & Proteins
  { id: "meat-breaded-chicken", name: "Breaded Chicken", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-roast-chicken-strips", name: "Roast Chicken Breast Strips", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-ham", name: "Ham", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-turkey-breast", name: "Turkey Breast", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-bacon", name: "Bacon", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-pepperoni", name: "Pepperoni", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-salami", name: "Salami", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-chicken-tikka", name: "Chicken Tikka", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-rotisserie-chicken", name: "Rotisserie-Style Chicken", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-nacho-chicken-bites", name: "Nacho Chicken Bites", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-shawarma-chicken", name: "Shawarma Spiced Chicken", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-meatballs-marinara", name: "Meatballs (in Marinara Sauce)", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-meatballs-bbq", name: "Meatballs (in BBQ Sauce)", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-breakfast-sausage-patty", name: "Breakfast Sausage Patty", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-philly-steak", name: "Philly Steak", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-taco-beef", name: "Taco Beef", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-beef-brisket-chilli", name: "Beef Brisket Chilli with Beans", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-pulled-pork", name: "Pulled Pork", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-tuna", name: "Tuna (with Lite Mayonnaise)", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-poached-egg", name: "Poached Egg", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-5-bean-chilli", name: "5 Bean Chilli", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-pulled-plant", name: "Pulled Plant", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-plant-patty", name: "Plant Patty", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-falafel", name: "Falafel", category: "Meat & Proteins", unit: "ea" },

  // Cheese
  { id: "cheese-american-sliced", name: "American Sliced Cheese", category: "Cheese", unit: "ea" },
  { id: "cheese-shredded-mozzarella-cheddar", name: "Shredded Mozzarella & Cheddar Cheese", category: "Cheese", unit: "kg" },
  { id: "cheese-mozzarella", name: "Mozzarella", category: "Cheese", unit: "kg" },
  { id: "cheese-peppered", name: "Peppered Cheese", category: "Cheese", unit: "kg" },
  { id: "cheese-vegan-cheeze", name: "Vegan CheeZe", category: "Cheese", unit: "ea" },

  // Vegetables & Produce
  { id: "veg-jalapenos", name: "Jalapeños", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-lettuce", name: "Lettuce", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-cucumber", name: "Cucumber", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-mixed-peppers", name: "Mixed Peppers", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-tomato", name: "Tomato", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-onion", name: "Onion", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-pickles", name: "Pickles", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-sweetcorn", name: "Sweetcorn", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-olives", name: "Olives", category: "Vegetables & Produce", unit: "kg" },

  // Sauces & Condiments
  { id: "sauce-cranberry", name: "Cranberry Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-bbq", name: "BBQ Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-hp-brown", name: "HP Brown Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-chipotle-southwest", name: "Chipotle Southwest Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-extra-spicy-chipotle", name: "Extra-Spicy Chipotle", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-lite-mayo", name: "Lite Mayonnaise", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-garlic-herb", name: "Garlic & Herb Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-teriyaki", name: "Teriyaki Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-sweet-onion", name: "Sweet Onion Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-tomato-ketchup", name: "Tomato Ketchup", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-sweet-chilli", name: "Sweet Chilli Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-yoghurt-mint-garlic", name: "Yoghurt, Mint & Garlic Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-marinara", name: "Marinara Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-salsa", name: "Salsa", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-garlic-infused-oil", name: "Garlic-Infused Oil", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-ranch", name: "Ranch Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-caramelised-red-onion", name: "Caramelised Red Onion in Balsamic Vinegar", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-guacamole", name: "Guacamole", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-sage-onion-stuffing", name: "Sage & Onion Stuffing", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-honey-mustard", name: "Honey Mustard Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-crispy-onions", name: "Crispy Onions", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-sea-salt", name: "Sea Salt", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-mixed-peppercorns", name: "Mixed Peppercorns", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-southwest-seasoning", name: "Southwest Seasoning", category: "Sauces & Condiments", unit: "kg" },

  // Desserts
  { id: "dessert-footlong-cookie", name: "Footlong Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-footlong-churro", name: "Footlong Churro", category: "Desserts", unit: "ea" },
  { id: "dessert-caramel-sauce", name: "Caramel Sauce", category: "Desserts", unit: "kg" },
  { id: "dessert-choc-chunk-cookie", name: "Chocolate Chunk Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-mini-choc-chunk-cookie", name: "Mini Chocolate Chunk Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-white-macadamia-cookie", name: "White Macadamia Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-rainbow-choc-chip-cookie", name: "Rainbow Chocolate Chip Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-double-choc-cookie", name: "Double Chocolate Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-raspberry-cheesecake-cookie", name: "Raspberry Cheesecake Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-oat-raisin-cookie", name: "Oat & Raisin Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-salted-caramel-brownie-cookie", name: "Salted Caramel Brownie Cookie", category: "Desserts", unit: "ea" },
  { id: "dessert-oreo-muffin", name: "Oreo® Muffin", category: "Desserts", unit: "ea" },
  { id: "dessert-oreo-cookie-cup", name: "Oreo® Cookie Cup", category: "Desserts", unit: "ea" },
  { id: "dessert-brownie-cookie-cup", name: "Brownie Cookie Cup", category: "Desserts", unit: "ea" },
  { id: "dessert-sugared-donut", name: "Sugared Donut", category: "Desserts", unit: "ea" },
  { id: "dessert-chocolate-donut", name: "Chocolate Donut", category: "Desserts", unit: "ea" },
  { id: "dessert-cinnamon-roll", name: "Cinnamon Roll", category: "Desserts", unit: "ea" },

  // Snacks & Sides
  { id: "snack-doritos-lightly-salted", name: "Doritos® Nachos (Lightly Salted)", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-doritos-tangy-cheese", name: "Doritos® Nachos (Tangy Cheese)", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-doritos-chilli-heatwave", name: "Doritos® Nachos (Chilli Heatwave)", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-doritos-loaded-beef-brisket", name: "Doritos® Loaded Nachos – Beef Brisket Chilli", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-doritos-loaded-5-bean", name: "Doritos® Loaded Nachos – 5 Bean Chilli", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-chipotle-cheesy-bites", name: "Chipotle Cheesy Bites", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-jacket-potato", name: "Jacket Potato", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-baked-beans", name: "Baked Beans", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-coleslaw", name: "Coleslaw", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-butter", name: "Butter", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-hash-browns", name: "Hash Browns", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-waffle-fries", name: "Waffle Fries", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-loaded-waffle-fries-beef-brisket", name: "Loaded Waffle Fries – Beef Brisket Chilli", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-loaded-waffle-fries-5-bean", name: "Loaded Waffle Fries – 5 Bean Chilli", category: "Snacks & Sides", unit: "kg" },
  { id: "snack-quaker-oats-golden-syrup", name: "Quaker Oats – Golden Syrup", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-quaker-oats-hearty-original", name: "Quaker Oats – Hearty Original", category: "Snacks & Sides", unit: "ea" },
  { id: "snack-quaker-oats-apple-blueberry", name: "Quaker Oats – Apple & Blueberry", category: "Snacks & Sides", unit: "ea" },

  // Drinks
  { id: "drink-coffee-syrup-vanilla", name: "Coffee Syrup – Vanilla", category: "Drinks", unit: "kg" },
  { id: "drink-coffee-syrup-caramel", name: "Coffee Syrup – Caramel", category: "Drinks", unit: "kg" },
  { id: "drink-coffee-syrup-chocolate", name: "Coffee Syrup – Chocolate", category: "Drinks", unit: "kg" },
  { id: "drink-coffee-syrup-hazelnut", name: "Coffee Syrup – Hazelnut", category: "Drinks", unit: "kg" },
  { id: "drink-coffee-syrup-honeycomb", name: "Coffee Syrup – Honeycomb", category: "Drinks", unit: "kg" },
  { id: "drink-black-coffee-tea", name: "Black Coffee / Americano / Espresso / Tea", category: "Drinks", unit: "ea" },
  { id: "drink-cappuccino-latte-flat-white", name: "Cappuccino / Latte / Flat White / Coffee with Milk / Tea with Milk", category: "Drinks", unit: "ea" },
  { id: "drink-oatly-cappuccino-latte", name: "Oatly® Cappuccino / Latte / Flat White / Tea", category: "Drinks", unit: "ea" },
  { id: "drink-hot-chocolate", name: "Hot Chocolate", category: "Drinks", unit: "ea" },
  { id: "drink-chocolate-sprinkles", name: "Chocolate Sprinkles", category: "Drinks", unit: "kg" },
  { id: "drink-fountain-robinsons", name: "Fountain Drink – Robinsons® Apple & Blackcurrant", category: "Drinks", unit: "ea" },
  { id: "drink-fountain-other", name: "Other Fountain Drink Options", category: "Drinks", unit: "ea" },
];

export const CATEGORY_ORDER: string[] = Array.from(
  new Set(PRODUCTS.map((p) => p.category)),
);
