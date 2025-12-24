import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";
import { CartState } from "@/types/cart";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.code === action.payload.code
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }

      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.code !== action.payload
      );
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ code: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product.code === action.payload.code
      );

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.product.code !== action.payload.code
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
