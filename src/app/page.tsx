"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelect from "@/components/SortSelect";
import CartButton from "@/components/CartButton";
import Cart from "@/components/Cart";
import { Product, SortOption } from "@/types/product";
import {
  searchProducts,
  getProductsByCategory,
  getAllProducts,
  getPopularCategories,
  getProductByBarcode,
} from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "barcode">("name");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState<SortOption | "">("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = getPopularCategories();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (selectedCategory) {
        result = await getProductsByCategory(selectedCategory, page);
      } else {
        result = await getAllProducts(page);
      }

      if (page === 1) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }

      setHasMore(result.page < result.page_count);

      if (result.products.length === 0 && page === 1) {
        setError(
          "Unable to load products from OpenFoodFacts API. The service may be experiencing high traffic or temporary downtime. " +
            "This is a known limitation of the free public API. Please try again in a few moments."
        );
      }
    } catch (err) {
      setError(
        "Unable to load products. The OpenFoodFacts API may be experiencing issues. Please try again in a few moments."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setPage(1);
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPage(1);

      if (searchType === "barcode") {
        const result = await getProductByBarcode(searchTerm.trim());
        if (result.status === 1 && result.product) {
          setProducts([result.product]);
          setHasMore(false);
        } else {
          setProducts([]);
          setError("Product not found with this barcode.");
        }
      } else {
        const result = await searchProducts(searchTerm, 1);
        setProducts(result.products);
        setHasMore(result.page < result.page_count);
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortOption) return 0;

    switch (sortOption) {
      case "name-asc":
        return (a.product_name || "").localeCompare(b.product_name || "");
      case "name-desc":
        return (b.product_name || "").localeCompare(a.product_name || "");
      case "grade-asc": {
        const gradeA = a.nutriscore_grade || a.nutrition_grades || "z";
        const gradeB = b.nutriscore_grade || b.nutrition_grades || "z";
        return gradeA.localeCompare(gradeB);
      }
      case "grade-desc": {
        const gradeA = a.nutriscore_grade || a.nutrition_grades || "";
        const gradeB = b.nutriscore_grade || b.nutrition_grades || "";
        return gradeB.localeCompare(gradeA);
      }
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-neutral-950">
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="absolute top-8 right-4">
            <CartButton />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                FOOD EXPLORER
              </h1>
            </div>
            <p className="text-neutral-400 text-sm md:text-base max-w-lg mx-auto">
              Discover nutritional information for thousands of food products
            </p>
          </div>

          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder={
                searchType === "barcode"
                  ? "Enter product barcode..."
                  : "Search for food products..."
              }
            />
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setSearchType("name")}
              className={`px-8 py-2.5 rounded-full transition-all font-bold text-sm tracking-wide flex items-center gap-2 ${
                searchType === "name"
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              BY NAME
            </button>
            <button
              onClick={() => setSearchType("barcode")}
              className={`px-8 py-2.5 rounded-full transition-all font-bold text-sm tracking-wide flex items-center gap-2 ${
                searchType === "barcode"
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              BY BARCODE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={handleCategoryChange}
            />
            <SortSelect value={sortOption} onChange={setSortOption} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        {error && (
          <div className="bg-neutral-900 border border-neutral-700 text-neutral-300 px-6 py-5 rounded-2xl mb-8 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg
                className="w-6 h-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-semibold text-white">
                Something went wrong
              </span>
            </div>
            <p className="text-neutral-400">{error}</p>
          </div>
        )}

        {loading && page === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden h-full"
              >
                <div className="relative w-full h-52 shimmer"></div>
                <div className="p-5">
                  <div className="h-5 shimmer rounded-lg mb-3 w-4/5"></div>
                  <div className="h-4 shimmer rounded-lg w-2/3 mb-3"></div>
                  <div className="h-6 shimmer rounded-full w-24 mb-4"></div>
                  <div className="h-px bg-neutral-800 my-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 shimmer rounded w-24"></div>
                    <div className="h-4 shimmer rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading || page > 1 ? (
          <>
            {sortedProducts.length > 0 ? (
              <>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.code} product={product} />
                  ))}
                </div>

                {hasMore && !searchTerm && (
                  <div className="flex justify-center mt-96">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="group relative bg-white hover:bg-neutral-200 text-black px-12 py-4 rounded-full font-black text-sm tracking-wider transition-all hover:scale-105 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          LOADING...
                        </>
                      ) : (
                        <>
                          LOAD MORE
                          <svg
                            className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              !loading && (
                <div className="text-center py-24">
                  <div className="max-w-md mx-auto">
                    <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                      <svg
                        className="w-14 h-14 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-white mb-3">
                      No products found
                    </p>
                    <p className="text-neutral-500 mb-8">
                      Try adjusting your search or filters to find what
                      you&apos;re looking for
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("");
                        setPage(1);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors border border-neutral-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reset Filters
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        ) : null}
      </div>

      <footer className="border-t border-neutral-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm">
            Powered by{" "}
            <a
              href="https://world.openfoodfacts.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-300 transition-colors"
            >
              OpenFoodFacts
            </a>
          </p>
        </div>
      </footer>

      <Cart />
    </main>
  );
}
