interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search for food products...",
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <div className="absolute left-5 text-neutral-500 group-focus-within:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-14 pr-32 py-4 text-base bg-neutral-900 border-2 border-neutral-700 text-white rounded-full focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-500/20 transition-all placeholder-neutral-500 font-medium"
        />
        <button
          onClick={onSearch}
          className="absolute right-2 bg-white hover:bg-neutral-200 text-black px-8 py-2.5 rounded-full transition-all font-bold text-sm tracking-wide hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          SEARCH
        </button>
      </div>
    </div>
  );
}
