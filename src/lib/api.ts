import { ProductsResponse, ProductDetailResponse, Product } from "@/types/product";

// Fetch products by search term
export async function searchProducts(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductsResponse> {
  try {
    const url = `/api/search?search_terms=${encodeURIComponent(
      searchTerm
    )}&page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    const data: ProductsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_count: 0,
      page_size: pageSize,
      skip: 0,
    };
  }
}

// Fetch product by barcode
export async function getProductByBarcode(
  barcode: string
): Promise<ProductDetailResponse> {
  try {
    const url = `/api/product/${barcode}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    const data: ProductDetailResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return {
      code: barcode,
      product: {
        code: barcode,
        product_name: "Error loading product",
      } as Product,
      status: 0,
      status_verbose: "error",
    };
  }
}

// Fetch products by category
export async function getProductsByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductsResponse> {
  try {
    const url = `/api/category/${encodeURIComponent(
      category
    )}?page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    const data: ProductsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_count: 0,
      page_size: pageSize,
      skip: 0,
    };
  }
}

// Get popular categories (hardcoded list of popular categories)
export function getPopularCategories(): string[] {
  return [
    "beverages",
    "snacks",
    "dairy",
    "breakfast",
    "cheese",
    "chocolates",
    "yogurts",
    "cookies",
    "cereals",
    "breads",
    "fruits",
    "vegetables",
    "meats",
    "seafood",
    "desserts",
  ];
}

// Fetch all products (default)
export async function getAllProducts(
  page: number = 1,
  pageSize: number = 24
): Promise<ProductsResponse> {
  try {
    const url = `/api/products?page=${page}&page_size=${pageSize}`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    const data: ProductsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_count: 0,
      page_size: pageSize,
      skip: 0,
    };
  }
}
