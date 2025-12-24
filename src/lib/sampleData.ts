import { Product } from "@/types/product";

export const sampleProducts: Product[] = [
  {
    code: "737628064502",
    product_name: "Organic Milk",
    brands: "Horizon Organic",
    categories: "Dairy, Milk",
    image_url: "https://via.placeholder.com/200?text=Milk",
    nutriscore_grade: "a",
    ingredients_text: "Organic Grade A Lowfat Milk, Vitamin A Palmitate, Vitamin D3",
    nutriments: {
      "energy-kcal_100g": 50,
      fat_100g: 1.5,
      carbohydrates_100g: 5,
      proteins_100g: 3.5,
    },
  },
  {
    code: "5000112548426",
    product_name: "Chocolate Bar",
    brands: "Cadbury",
    categories: "Snacks, Sweets, Chocolate",
    image_url: "https://via.placeholder.com/200?text=Chocolate",
    nutriscore_grade: "d",
    ingredients_text: "Milk chocolate, Sugar, Cocoa butter, Cocoa mass, Milk powder",
    nutriments: {
      "energy-kcal_100g": 530,
      fat_100g: 30,
      carbohydrates_100g: 57,
      sugars_100g: 56,
      proteins_100g: 7.3,
    },
  },
  {
    code: "8076809513296",
    product_name: "Whole Wheat Bread",
    brands: "Nature's Own",
    categories: "Breads",
    image_url: "https://via.placeholder.com/200?text=Bread",
    nutriscore_grade: "b",
    ingredients_text: "Whole wheat flour, Water, Yeast, Salt",
    nutriments: {
      "energy-kcal_100g": 247,
      fat_100g: 3.5,
      carbohydrates_100g: 43,
      proteins_100g: 8,
    },
  },
];

export function getSampleProductsResponse(page: number = 1, pageSize: number = 24) {
  // Duplicate sample products to fill the page
  const products = [];
  for (let i = 0; i < pageSize; i++) {
    const sampleProduct = sampleProducts[i % sampleProducts.length];
    products.push({
      ...sampleProduct,
      code: `${sampleProduct.code}-${i}`,
      product_name: `${sampleProduct.product_name} (Sample ${i + 1})`,
    });
  }

  return {
    count: products.length,
    page: page,
    page_count: 1,
    page_size: pageSize,
    products: products,
    skip: 0,
  };
}
