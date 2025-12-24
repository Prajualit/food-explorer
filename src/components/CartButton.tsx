"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCart } from "@/store/cartSlice";

export default function CartButton() {
  const dispatch = useAppDispatch();
  const totalItems = useAppSelector((state) => state.cart.totalItems);

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      className="relative p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all hover:scale-105 group cursor-pointer"
    >
      <svg
        className="w-6 h-6 text-white"
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
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
