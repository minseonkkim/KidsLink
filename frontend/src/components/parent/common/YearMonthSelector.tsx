import { useEffect, useRef } from "react"

interface YearMonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  handleYearChange: (increment: number) => void;
  handleMonthChange: (month: number) => void;
}

export default function YearMonthSelector({ selectedYear, selectedMonth, handleYearChange, handleMonthChange }: YearMonthSelectorProps) {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ]

  const monthRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (monthRef.current) {
      const selectedElement = monthRef.current.querySelector(`#month-${selectedMonth}`) as HTMLElement
      if (selectedElement) {
        const offset = selectedElement.offsetLeft - monthRef.current.offsetWidth / 2 + selectedElement.offsetWidth / 2;
        monthRef.current.scrollTo({ left: offset, behavior: 'auto' })
      }
    }
  }, [])


  useEffect(() => {
    if (monthRef.current) {
      const selectedElement = monthRef.current.querySelector(`#month-${selectedMonth}`) as HTMLElement;
      if (selectedElement) {
        const offset = selectedElement.offsetLeft - monthRef.current.offsetWidth / 2 + selectedElement.offsetWidth / 2;
        monthRef.current.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }
  }, [selectedMonth])

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <button onClick={() => handleYearChange(-1)} className="text-lg">{"<"}</button>
        <span className="text-xl font-bold">{selectedYear}년</span>
        <button onClick={() => handleYearChange(1)} className="text-lg">{">"}</button>
      </div>
      <div className="overflow-x-auto flex items-center mb-8 space-x-2" ref={monthRef}>
        {months.map((month, index) => (
          <button
            key={index}
            id={`month-${index + 1}`}
            className={`px-2 py-1 whitespace-nowrap rounded ${selectedMonth === index + 1 ? 'bg-[#FFEC8A] text-gray-800 font-bold' : 'bg-transparent text-gray-800 font-normal'} transition-colors duration-200`}
            onClick={() => handleMonthChange(index + 1)}
            style={{ fontSize: '16px' }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  )
}
