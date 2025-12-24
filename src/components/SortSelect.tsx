import { SortOption } from "@/types/product";

interface SortSelectProps {
  value: SortOption | "";
  onChange: (value: SortOption | "") => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="w-full relative">
      <label
        htmlFor="sort-select"
        className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider flex items-center gap-2"
      >
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        SORT BY
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption | "")}
          className="w-full pl-12 pr-10 py-3.5 border-2 border-neutral-800 rounded-xl focus:outline-none focus:border-neutral-500 focus:ring-4 focus:ring-neutral-500/20 transition-all bg-neutral-900 text-white font-medium appearance-none cursor-pointer hover:border-neutral-600"
        >
          <option value="">Default Order</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="grade-asc">Best Nutrition First</option>
          <option value="grade-desc">Worst Nutrition First</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400 group-focus-within:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
