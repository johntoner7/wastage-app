import type { Product } from "../types";

/**
 * Store product catalogue. Ordered by category, then by the order items
 * appear on the prep line — edit freely to match your own store's range.
 *
 * unit: "kg" for anything weighed for wastage, "ea" for anything counted
 * as whole items/pieces.
 */
export const PRODUCTS: Product[] = [
  // Bread
  { id: "bread-italian-white", name: "Italian White", category: "Bread", unit: "ea" },
  { id: "bread-italian-herb-cheese", name: "Italian Herb & Cheese", category: "Bread", unit: "ea" },
  { id: "bread-honey-oat", name: "Honey Oat", category: "Bread", unit: "ea" },
  { id: "bread-flatbread", name: "Flatbread", category: "Bread", unit: "ea" },
  { id: "bread-gluten-free-roll", name: "Gluten Free Roll", category: "Bread", unit: "ea" },
  { id: "bread-wrap-30cm", name: "Tortilla Wrap 30cm", category: "Bread", unit: "ea" },

  // Meat & Proteins
  { id: "meat-smoked-ham", name: "Smoked Ham", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-turkey-breast", name: "Turkey Breast", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-pepperoni", name: "Pepperoni", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-salami", name: "Salami", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-roast-beef", name: "Roast Beef", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-chicken-strips", name: "Chicken Strips", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-rotisserie-chicken", name: "Rotisserie-Style Chicken", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-bacon", name: "Bacon", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-steak", name: "Steak", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-meatballs", name: "Meatballs", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-tuna-mix", name: "Tuna Mix", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-egg-mayo", name: "Egg Mayo", category: "Meat & Proteins", unit: "kg" },
  { id: "meat-falafel", name: "Falafel", category: "Meat & Proteins", unit: "ea" },
  { id: "meat-chickpea", name: "Roasted Chickpeas", category: "Meat & Proteins", unit: "kg" },

  // Cheese
  { id: "cheese-shredded-blend", name: "Shredded Cheddar & Monterey", category: "Cheese", unit: "kg" },
  { id: "cheese-american-slice", name: "American Cheese Slices", category: "Cheese", unit: "ea" },
  { id: "cheese-swiss-slice", name: "Swiss-Style Cheese Slices", category: "Cheese", unit: "ea" },

  // Vegetables & Produce
  { id: "veg-lettuce", name: "Lettuce", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-tomatoes", name: "Tomatoes", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-cucumbers", name: "Cucumbers", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-green-peppers", name: "Green Peppers", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-red-onions", name: "Red Onions", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-jalapenos", name: "Jalapeños", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-black-olives", name: "Black Olives", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-pickles", name: "Pickles", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-spinach", name: "Spinach", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-banana-peppers", name: "Banana Peppers", category: "Vegetables & Produce", unit: "kg" },
  { id: "veg-avocado", name: "Avocado", category: "Vegetables & Produce", unit: "ea" },

  // Sauces & Condiments
  { id: "sauce-mayo", name: "Mayo", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-chipotle-southwest", name: "Chipotle Southwest", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-sweet-onion", name: "Sweet Onion", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-honey-mustard", name: "Honey Mustard", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-bbq", name: "BBQ Sauce", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-ranch", name: "Ranch", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-marinara", name: "Marinara", category: "Sauces & Condiments", unit: "kg" },
  { id: "sauce-buffalo", name: "Buffalo Sauce", category: "Sauces & Condiments", unit: "kg" },

  // Cookies & Bakery
  { id: "bakery-choc-chip", name: "Chocolate Chip Cookie", category: "Cookies & Bakery", unit: "ea" },
  { id: "bakery-double-choc", name: "Double Chocolate Cookie", category: "Cookies & Bakery", unit: "ea" },
  { id: "bakery-white-choc-macadamia", name: "White Chip Macadamia Cookie", category: "Cookies & Bakery", unit: "ea" },
  { id: "bakery-oatmeal-raisin", name: "Oatmeal Raisin Cookie", category: "Cookies & Bakery", unit: "ea" },
  { id: "bakery-salted-caramel-brownie", name: "Salted Caramel Brownie", category: "Cookies & Bakery", unit: "ea" },

  // Drinks & Extras
  { id: "drink-coke", name: "Coca-Cola 500ml", category: "Drinks & Extras", unit: "ea" },
  { id: "drink-sprite", name: "Sprite 500ml", category: "Drinks & Extras", unit: "ea" },
  { id: "drink-orange-juice", name: "Orange Juice", category: "Drinks & Extras", unit: "ea" },
  { id: "drink-water", name: "Bottled Water", category: "Drinks & Extras", unit: "ea" },
  { id: "crisps-ready-salted", name: "Crisps – Ready Salted", category: "Drinks & Extras", unit: "ea" },
  { id: "crisps-salt-vinegar", name: "Crisps – Salt & Vinegar", category: "Drinks & Extras", unit: "ea" },
];

export const CATEGORY_ORDER: string[] = Array.from(
  new Set(PRODUCTS.map((p) => p.category)),
);
