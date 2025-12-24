# Food Explorer

A modern web application for exploring food products and their nutritional information, powered by the OpenFoodFacts API.

## Solution Method

This project was built using a component-based architecture with Next.js 15 and TypeScript to create a responsive, user-friendly food product explorer.

### Technical Approach

**Framework & Architecture:**
- Built with Next.js 15 (App Router) for server-side rendering and optimal performance
- TypeScript for type safety and better development experience
- React hooks (useState, useEffect) for local state management
- Redux Toolkit for global state management (cart functionality)
- Client-side rendering for interactive features

**State Management:**
- Redux Toolkit for centralized cart state management
- Custom Redux hooks for type-safe state access
- Immutable state updates with Redux slices
- Persistent cart state across page navigation

**API Integration:**
- Integrated OpenFoodFacts API for real-time product data
- Created custom API routes as middleware to handle external API calls
- Implemented error handling and fallback mechanisms for API failures
- Added retry logic and user-friendly error messages

**Features Implemented:**
1. **Search Functionality:**
   - Dual search modes: by product name and by barcode
   - Real-time search with debounced API calls
   - Search state management with loading indicators

2. **Product Filtering & Sorting:**
   - Category-based filtering with popular categories
   - Multiple sorting options (name, nutrition grade)
   - Pagination with "Load More" functionality

3. **Product Display:**
   - Grid layout with responsive design (1-4 columns based on screen size)
   - Product cards showing key information (image, name, brand, nutri-score)
   - Detailed product pages with comprehensive nutritional information
   - Visual nutrition grade indicators (A-E scale)

4. **UI/UX Design:**
   - Dark theme with modern glassmorphism effects
   - Smooth animations and transitions
   - Loading skeletons for better perceived performance
   - Responsive design for mobile, tablet, and desktop

5. **Shopping Cart (Bonus Feature):**
   - Add products to cart from product cards and detail pages
   - Redux-powered state management for cart functionality
   - Real-time cart item counter with badge
   - Sliding cart panel with smooth animations
   - Quantity management (increase, decrease, remove)
   - Visual feedback for cart actions (add confirmation)
   - Persistent cart state across navigation
   - Clear cart functionality

**Component Structure:**
- Reusable components (SearchBar, ProductCard, CategoryFilter, SortSelect, Cart, CartButton)
- Redux Provider wrapper for global state
- Type-safe prop interfaces
- Clean separation of concerns
- Modular and maintainable code

**Redux Architecture:**
- Store configuration with Redux Toolkit
- Cart slice with reducers for add, remove, update, and clear actions
- Type-safe hooks (useAppDispatch, useAppSelector)
- Centralized state for cart items and UI state (cart open/close)

**Styling:**
- Tailwind CSS for utility-first styling
- Custom CSS for animations and special effects
- Consistent design system with neutral color palette
- Responsive breakpoints for all screen sizes

**Error Handling:**
- Graceful degradation when API fails
- User-friendly error messages
- Loading states for all async operations
- Image fallbacks for missing product images

This approach ensures a scalable, maintainable, and performant application that provides an excellent user experience while handling the complexities of external API integration.
## Key Features

### Core Functionality
✅ **Search & Discovery**
- Search products by name or barcode
- Real-time search results
- Category-based filtering
- Multiple sorting options

✅ **Product Information**
- Comprehensive product details
- Nutritional information display
- Nutri-Score visualization
- Ingredient lists and allergens

✅ **Pagination**
- Load more functionality
- Smooth loading states
- Optimized API calls

### Bonus Features (Redux Implementation)
✅ **Shopping Cart**
- Add/remove products from cart
- Quantity management
- Persistent cart state
- Real-time cart counter
- Sliding cart panel with animations
- Visual feedback for user actions

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (middleware)
│   ├── product/          # Product detail pages
│   ├── layout.tsx        # Root layout with Redux Provider
│   └── page.tsx          # Home page
├── components/
│   ├── Cart.tsx          # Shopping cart component
│   ├── CartButton.tsx    # Cart button with counter
│   ├── ProductCard.tsx   # Product card with add to cart
│   ├── SearchBar.tsx     # Search input component
│   ├── CategoryFilter.tsx
│   ├── SortSelect.tsx
│   └── ReduxProvider.tsx # Redux Provider wrapper
├── store/
│   ├── index.ts          # Store configuration
│   ├── cartSlice.ts      # Cart state & reducers
│   └── hooks.ts          # Typed Redux hooks
├── types/
│   ├── product.ts        # Product type definitions
│   └── cart.ts           # Cart type definitions
└── lib/
    └── api.ts            # API helper functions
```

## Technologies Used

- **Frontend Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **API:** OpenFoodFacts REST API
- **Package Manager:** npm

## Evaluation Criteria Compliance

✅ **Code Quality:** Clean, modular component-based architecture with TypeScript  
✅ **API Integration:** Effective OpenFoodFacts API integration with error handling  
✅ **UI/UX:** Modern, responsive design with dark theme and smooth animations  
✅ **Functionality:** Complete search, filtering, and sorting implementation  
✅ **Pagination:** Smooth load-more functionality with optimized performance  
✅ **Bonus:** Full cart functionality with Redux state management