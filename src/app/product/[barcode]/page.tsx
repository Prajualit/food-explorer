"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { getProductByBarcode } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import Cart from "@/components/Cart";
import CartButton from "@/components/CartButton";

export default function ProductDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const barcode = params.barcode as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProductByBarcode(barcode);

        if (result.status === 1 && result.product) {
          setProduct(result.product);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchProductDetails();
    }
  }, [barcode]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const getGradeStyles = (grade?: string) => {
    if (!grade) return { bg: "bg-neutral-600", text: "text-white" };
    const lowerGrade = grade.toLowerCase();
    switch (lowerGrade) {
      case "a":
        return {
          bg: "bg-gradient-to-br from-green-400 to-green-600",
          text: "text-white",
        };
      case "b":
        return {
          bg: "bg-gradient-to-br from-lime-400 to-lime-600",
          text: "text-white",
        };
      case "c":
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
          text: "text-black",
        };
      case "d":
        return {
          bg: "bg-gradient-to-br from-orange-400 to-orange-600",
          text: "text-white",
        };
      case "e":
        return {
          bg: "bg-gradient-to-br from-red-400 to-red-600",
          text: "text-white",
        };
      default:
        return { bg: "bg-neutral-600", text: "text-white" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <header className="bg-neutral-900 border-b border-neutral-800">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse"></div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Skeleton Image */}
              <div className="flex flex-col">
                <div className="relative w-full h-96 bg-neutral-800 rounded-xl shimmer"></div>
                <div className="mt-6 space-y-3">
                  <div className="h-4 bg-neutral-800 rounded w-1/4 shimmer"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-neutral-800 rounded-full shimmer"></div>
                    <div className="h-8 w-24 bg-neutral-800 rounded-full shimmer"></div>
                  </div>
                </div>
              </div>
              {/* Skeleton Details */}
              <div className="flex flex-col space-y-4">
                <div className="h-10 bg-neutral-800 rounded-lg w-3/4 shimmer"></div>
                <div className="h-6 bg-neutral-800 rounded-lg w-1/2 shimmer"></div>
                <div className="h-14 bg-neutral-800 rounded-full w-28 shimmer"></div>
                <div className="space-y-3 mt-6">
                  <div className="h-4 bg-neutral-800 rounded shimmer"></div>
                  <div className="h-4 bg-neutral-800 rounded w-5/6 shimmer"></div>
                  <div className="h-4 bg-neutral-800 rounded w-4/6 shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {error || "Product not found"}
          </p>
          <p className="text-neutral-400 mb-8">
            We couldn&apos;t find the product you&apos;re looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-white hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const imageUrl =
    product.image_url || product.image_front_url || product.image_small_url;
  const rawGrade = product.nutriscore_grade || product.nutrition_grades;
  const validGrades = ["a", "b", "c", "d", "e"];
  const nutritionGrade =
    rawGrade && validGrades.includes(rawGrade.toLowerCase())
      ? rawGrade
      : undefined;
  const gradeStyles = getGradeStyles(nutritionGrade);

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-white hover:text-neutral-300 font-bold flex items-center gap-2 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>BACK TO PRODUCTS</span>
          </button>

          <CartButton />

          <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-sm">
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
            <span className="font-mono">{product.code}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            <div className="flex flex-col">
              <div className="relative w-full h-80 md:h-96 bg-neutral-800/30 rounded-xl overflow-hidden border border-neutral-800">
                {imageUrl && !imageError ? (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 shimmer"></div>
                    )}
                    <Image
                      src={imageUrl}
                      alt={product.product_name || "Product"}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {product.labels_tags && product.labels_tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-sm text-neutral-400 mb-3 uppercase tracking-wider">
                    Labels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.labels_tags.slice(0, 10).map((label, index) => (
                      <span
                        key={index}
                        className="bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-full text-sm border border-neutral-700 hover:border-neutral-600 transition-colors"
                      >
                        {label.replace("en:", "").replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white leading-tight">
                {product.product_name || "Unknown Product"}
              </h1>

              {product.brands && (
                <p className="text-lg text-neutral-400 mb-6 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-neutral-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {product.brands}
                </p>
              )}

              <div className="mb-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-sm text-neutral-400 mb-3 uppercase tracking-wider">
                  Nutri-Score
                </h3>
                <div className="flex items-center gap-4">
                  {nutritionGrade ? (
                    <div
                      className={`${gradeStyles.bg} ${gradeStyles.text} w-16 h-16 flex items-center justify-center rounded-full text-3xl font-black uppercase shadow-lg`}
                    >
                      {nutritionGrade}
                    </div>
                  ) : (
                    <div className=" text-white flex items-center justify-center rounded-full text-lg font-medium">
                      N/A
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full mb-6 py-4 rounded-full font-bold text-base transition-all ${
                  addedToCart
                    ? "bg-neutral-700 text-white border-2 border-neutral-500"
                    : "bg-white hover:bg-neutral-200 text-black hover:scale-105"
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    ADDED TO CART
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    ADD TO CART
                  </span>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {product.categories && (
                  <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-800">
                    <h3 className="font-semibold text-sm text-neutral-500 mb-1 uppercase tracking-wider flex items-center gap-2">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Category
                    </h3>
                    <p className="text-neutral-300 text-sm line-clamp-2">
                      {product.categories.split(",")[0]}
                    </p>
                  </div>
                )}

                {product.serving_size && (
                  <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-800">
                    <h3 className="font-semibold text-sm text-neutral-500 mb-1 uppercase tracking-wider flex items-center gap-2">
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
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      Serving
                    </h3>
                    <p className="text-neutral-300 text-sm">
                      {product.serving_size}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-800 sm:hidden">
                  <h3 className="font-semibold text-sm text-neutral-500 mb-1 uppercase tracking-wider flex items-center gap-2">
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
                    Barcode
                  </h3>
                  <p className="text-neutral-300 text-sm font-mono">
                    {product.code}
                  </p>
                </div>

                {/* Stores */}
                {product.stores && (
                  <div className="p-4 bg-neutral-800/30 rounded-xl border border-neutral-800">
                    <h3 className="font-semibold text-sm text-neutral-500 mb-1 uppercase tracking-wider flex items-center gap-2">
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Available at
                    </h3>
                    <p className="text-neutral-300 text-sm">{product.stores}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 md:px-8 pb-8 space-y-6">
            {product.ingredients_text && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Ingredients
                </h2>
                <div className="bg-neutral-800/30 border border-neutral-800 p-5 rounded-xl">
                  <p className="text-neutral-300 leading-relaxed">
                    {product.ingredients_text}
                  </p>
                </div>
              </div>
            )}

            {product.allergens && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-neutral-500"
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
                  Allergens
                </h2>
                <div className="bg-neutral-800 p-5 rounded-xl border-2 border-neutral-700">
                  <p className="text-neutral-200 font-medium">
                    {product.allergens}
                  </p>
                </div>
              </div>
            )}

            {product.nutriments && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Nutritional Values
                  <span className="text-sm font-normal text-neutral-500">
                    (per 100g)
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {product.nutriments["energy-kcal_100g"] !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Energy
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments["energy-kcal_100g"]}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          kcal
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.fat_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Fat
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.fat_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments["saturated-fat_100g"] !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Saturated Fat
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments["saturated-fat_100g"]}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.carbohydrates_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Carbs
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.carbohydrates_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.sugars_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Sugars
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.sugars_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.fiber_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Fiber
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.fiber_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.proteins_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Proteins
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.proteins_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.salt_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Salt
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.salt_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                  {product.nutriments.sodium_100g !== undefined && (
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Sodium
                      </p>
                      <p className="text-xl font-bold text-white">
                        {product.nutriments.sodium_100g}{" "}
                        <span className="text-sm font-normal text-neutral-400">
                          g
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.countries && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Countries
                </h2>
                <p className="text-neutral-300">{product.countries}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 mt-8 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm">
            Data provided by{" "}
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
    </div>
  );
}
