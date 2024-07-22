import React from 'react';

interface SearchDateBarProps {
  searchDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchDateBar: React.FC<SearchDateBarProps> = ({ searchDate, handleDateChange }) => {
  return (
    <input
      type="date"
      value={searchDate}
      onChange={handleDateChange}
      className="w-full my-6 p-2 border-b-2 border-gray-300 focus:outline-none text-lg custom-placeholder::placeholder custom-border-color"
    />
  );
};

export default SearchDateBar;
