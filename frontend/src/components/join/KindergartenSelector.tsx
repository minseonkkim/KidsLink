// 유치원, 반 선택

import { useEffect, ChangeEvent, useState } from "react"
import {
  getAllKindergartens,
  getKindergartenClasses,
} from "../../api/kindergarten"

interface KindergartenSelectorProps {
  selectedKindergartenId: number | null;
  selectedKindergartenClassId: number | null;
  setSelectedKindergartenId: (id: number | null) => void;
  setSelectedKindergartenClassId: (id: number | null) => void;
}

interface Kindergarten {
  kindergartenId: number;
  kindergartenName: string;
}

interface KindergartenClass {
  kindergartenClassId: number;
  kindergartenClassName: string;
}

export default function KindergartenSelector({
  selectedKindergartenId,
  selectedKindergartenClassId,
  setSelectedKindergartenId,
  setSelectedKindergartenClassId,
}: KindergartenSelectorProps) {
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([])
  const [classes, setClasses] = useState<KindergartenClass[]>([])

  useEffect(() => {
    const fetchKindergartens = async () => {
      try {
        const data = await getAllKindergartens()
        setKindergartens(data)
      } catch (error) {
        console.error("Failed to fetch kindergartens", error)
      }
    }

    fetchKindergartens()
  }, [])

  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedKindergartenId !== null) {
        try {
          const data = await getKindergartenClasses(selectedKindergartenId)
          setClasses(data)
        } catch (error) {
          console.error("Failed to fetch classes", error)
        }
      }
    }

    fetchClasses()
  }, [selectedKindergartenId])

  const handleKindergartenChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10)
    setSelectedKindergartenId(selectedId)
    setClasses([])
    setSelectedKindergartenClassId(null)
  }

  const handleClassChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10)
    setSelectedKindergartenClassId(selectedId)
  }

  return (
    <div className="mt-5">
      <label className="block text-sm font-medium text-gray-400">
        유치원 및 반 선택 <span className="text-red-600">*</span>
      </label>
      <div className="flex mt-2 space-x-2">
        <select
          className="w-1/2 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
          value={selectedKindergartenId || ""}
          onChange={handleKindergartenChange}
        >
          <option value="" disabled>
            유치원 선택
          </option>
          {kindergartens
            .filter((kg) => kg.kindergartenName !== "떡잎 유치원") // 시연 위해서 "떡잎 유치원" 제외
            .map((kg) => (
              <option key={kg.kindergartenId} value={kg.kindergartenId}>
                {kg.kindergartenName}
              </option>
            ))}
        </select>
        <select
          className="w-1/2 border border-gray-400 rounded-md p-2 bg-white focus:ring-2 focus:ring-[#F8DE56]"
          value={selectedKindergartenClassId || ""}
          onChange={handleClassChange}
        >
          <option value="" disabled>
            반 선택
          </option>
          {classes.map((cls) => (
            <option key={cls.kindergartenClassId} value={cls.kindergartenClassId}>
              {cls.kindergartenClassName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
