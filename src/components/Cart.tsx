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
import { useState } from "react";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

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

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleConfirmCheckout = () => {
    setShowCheckout(false);
    setCheckoutSuccess(true);
    dispatch(clearCart());
    setTimeout(() => {
      setCheckoutSuccess(false);
      dispatch(setCartOpen(false));
    }, 2500);
  };

  const handleCancelCheckout = () => {
    setShowCheckout(false);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
                              className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors cursor-pointer"
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
                              className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors cursor-pointer"
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
                            className="text-red-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
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
              className="w-full py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors border border-neutral-700 cursor-pointer"
            >
              Clear Cart
            </button>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-full bg-white hover:bg-neutral-200 text-black font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {showCheckout && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 p-6">
            <div className="bg-neutral-800 rounded-2xl p-8 max-w-md w-full border border-neutral-700 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-neutral-900"
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
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Checkout</h3>
                <p className="text-neutral-400">
                  You have {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.product.code}
                    className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg"
                  >
                    <div className="text-white font-semibold text-sm flex-1 line-clamp-1">
                      {item.product.product_name}
                    </div>
                    <div className="text-neutral-400 text-sm">×{item.quantity}</div>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-center text-neutral-500 text-sm">
                    +{items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmCheckout}
                  className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold transition-all hover:scale-105 cursor-pointer"
                >
                  Confirm Order
                </button>
                <button
                  onClick={handleCancelCheckout}
                  className="w-full py-3 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {checkoutSuccess && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-10 p-6">
            <div className="bg-neutral-800 rounded-2xl p-8 max-w-md w-full border border-neutral-600 shadow-2xl text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
              <p className="text-neutral-400 mb-6">
                Thank you for your order. Your items have been processed successfully.
              </p>
              <div className="flex items-center justify-center gap-2 text-neutral-400 text-sm">
                <svg
                  className="w-4 h-4 animate-spin"
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
                Closing...
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
