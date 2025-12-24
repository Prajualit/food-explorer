// OpenFoodFacts API Response Types

export interface Product {
  _id?: string;
  code: string;
  product_name: string;
  brands?: string;
  categories?: string;
  categories_tags?: string[];
  image_url?: string;
  image_front_url?: string;
  image_small_url?: string;
  ingredients_text?: string;
  nutrition_grades?: string;
  nutriscore_grade?: string;
  nutriments?: Nutriments;
  labels?: string;
  labels_tags?: string[];
  allergens?: string;
  stores?: string;
  countries?: string;
  serving_size?: string;
}

export interface Nutriments {
  energy?: number;
  "energy-kcal"?: number;
  "energy-kcal_100g"?: number;
  energy_100g?: number;
  fat?: number;
  fat_100g?: number;
  "saturated-fat"?: number;
  "saturated-fat_100g"?: number;
  carbohydrates?: number;
  carbohydrates_100g?: number;
  sugars?: number;
  sugars_100g?: number;
  fiber?: number;
  fiber_100g?: number;
  proteins?: number;
  proteins_100g?: number;
  salt?: number;
  salt_100g?: number;
  sodium?: number;
  sodium_100g?: number;
}

export interface ProductsResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
}

export interface ProductDetailResponse {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
}

export interface SearchParams {
  search_terms?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  categories?: string;
}

export type SortOption = "name-asc" | "name-desc" | "grade-asc" | "grade-desc";

export type NutritionGrade = "a" | "b" | "c" | "d" | "e";
