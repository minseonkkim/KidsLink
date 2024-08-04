import { FaSearch } from "react-icons/fa"

export default function SearchTitleBar({ searchTitle, onSearch }) {
  return (
    <div className="relative w-full my-6">
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={searchTitle}
        onChange={onSearch}
        className="w-full p-2 pl-10 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  )
}
