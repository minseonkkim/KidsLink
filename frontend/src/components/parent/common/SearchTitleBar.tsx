interface SearchTitleBarProps {
  searchTitle: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchTitleBar ({ searchTitle, handleSearch }: SearchTitleBarProps) {
  return (
    <input
      type="text"
      placeholder="🔍︎"
      value={searchTitle}
      onChange={handleSearch}
      className="w-full my-6 p-2 border-b-2 border-gray-300 focus:outline-none text-lg custom-placeholder::placeholder custom-border-color"
    />
  )
}


