"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";

interface ProductCardProps {
  product: Product;
}

const getGradeStyles = (grade?: string) => {
  if (!grade) return { bg: "bg-neutral-600", text: "text-white" };
  const lowerGrade = grade.toLowerCase();
  switch (lowerGrade) {
    case "a":
      return {
        bg: "bg-gradient-to-br from-green-400 to-green-600",
        text: "text-white",
        shadow: "shadow-green-500/30",
      };
    case "b":
      return {
        bg: "bg-gradient-to-br from-lime-400 to-lime-600",
        text: "text-white",
        shadow: "shadow-lime-500/30",
      };
    case "c":
      return {
        bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
        text: "text-black",
        shadow: "shadow-yellow-500/30",
      };
    case "d":
      return {
        bg: "bg-gradient-to-br from-orange-400 to-orange-600",
        text: "text-white",
        shadow: "shadow-orange-500/30",
      };
    case "e":
      return {
        bg: "bg-gradient-to-br from-red-400 to-red-600",
        text: "text-white",
        shadow: "shadow-red-500/30",
      };
    default:
      return { bg: "bg-neutral-600", text: "text-white", shadow: "" };
  }
};

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const imageUrl =
    product.image_small_url || product.image_url || product.image_front_url;
  const rawGrade = product.nutriscore_grade || product.nutrition_grades;
  const validGrades = ['a', 'b', 'c', 'd', 'e'];
  const nutritionGrade = rawGrade && validGrades.includes(rawGrade.toLowerCase()) ? rawGrade : undefined;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const gradeStyles = getGradeStyles(nutritionGrade);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-neutral-600 transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-xl hover:shadow-black/30 group hover:-translate-y-1 relative z-0">
      <Link href={`/product/${product.code}`} className="flex-1 flex flex-col">
        <div className="relative w-full h-52 bg-neutral-800/30 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-transparent to-transparent opacity-60 pointer-events-none"></div>

          {imageUrl && !imageError ? (
            <>
              {imageLoading && <div className="absolute inset-0 shimmer"></div>}
              <Image
                src={imageUrl}
                alt={product.product_name || "Product image"}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-20 h-20 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-neutral-600"
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

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-12 text-white leading-tight group-hover:text-neutral-300 transition-colors">
            {product.product_name || "Unknown Product"}
          </h3>

          {product.brands && (
            <p className="text-sm text-neutral-400 mb-2 line-clamp-1 font-medium flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-neutral-500"
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

          {product.categories && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                {product.categories.split(",")[0].trim()}
              </span>
            </div>
          )}

          <div className="mt-auto pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {nutritionGrade ? (
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${gradeStyles.bg}`}
                  ></div>
                  <span className="text-xs text-neutral-500 font-medium">
                    Nutri-Score <span className="text-white font-bold">{nutritionGrade.toUpperCase()}</span>
                  </span>
                </div>
              ) : (
                <span className="text-xs text-neutral-600">N/A</span>
              )}
            </div>

            <div className="flex items-center gap-1 text-neutral-500 group-hover:text-white transition-colors">
              <span className="text-xs font-medium">View</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-full font-bold text-sm transition-all ${
            addedToCart
              ? "bg-neutral-700 text-white border-2 border-neutral-500"
              : "bg-white hover:bg-neutral-200 text-black hover:scale-105"
          }`}
        >
          {addedToCart ? (
            <span className="flex items-center justify-center gap-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              ADDED TO CART
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
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
              ADD TO CART
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
