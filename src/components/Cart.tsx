"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
} from "@/store/cartSlice";
import Image from "next/image";
import Link from "next/link";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleQuantityChange = (code: string, quantity: number) => {
    dispatch(updateQuantity({ code, quantity }));
  };

  const handleRemove = (code: string) => {
    dispatch(removeFromCart(code));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full sm:w-110 bg-neutral-900 border-l border-neutral-800 z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg
              className="w-6 h-6"
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
            Shopping Cart
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold text-white mb-2">Your cart is empty</p>
              <p className="text-neutral-500">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const imageUrl =
                  item.product.image_small_url ||
                  item.product.image_url ||
                  item.product.image_front_url;

                return (
                  <div
                    key={item.product.code}
                    className="bg-neutral-800/50 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex gap-4">
                      <Link
                        href={`/product/${item.product.code}`}
                        onClick={handleClose}
                        className="shrink-0"
                      >
                        <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={item.product.product_name || "Product"}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-neutral-600"
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
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.code}`}
                          onClick={handleClose}
                        >
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 hover:text-neutral-300 transition-colors">
                            {item.product.product_name || "Unknown Product"}
                          </h3>
                        </Link>
                        {item.product.brands && (
                          <p className="text-xs text-neutral-500 mb-3">
                            {item.product.brands}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.code,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors"
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
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.code,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors"
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.product.code)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-neutral-400">Total Items:</span>
              <span className="font-bold text-white">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <button
              onClick={handleClearCart}
              className="w-full py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors border border-neutral-700"
            >
              Clear Cart
            </button>

            <button className="w-full py-4 rounded-full bg-white hover:bg-neutral-200 text-black font-bold transition-all hover:scale-105 active:scale-95">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
