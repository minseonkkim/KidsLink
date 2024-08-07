import { useState } from "react";
import { useNavigate } from "react-router-dom";
import daramgi from "../../assets/parent/document-daramgi.png";
import {
  createDosageDocument,
  createAbsentDocument,
  DosageData,
  AbsentData,
} from "../../api/document";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import DateRangePicker from "../../components/parent/document/DateRangePicker";
import InputFields from "../../components/parent/document/InputFields";
import Modal from "../../components/parent/common/Modal";

export default function ParentDocument() {
  const [selectedOption, setSelectedOption] = useState<string>("dosage");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    [key: string]: string | number | undefined;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const childId = useParentInfoStore(
    (state) => state.parentInfo?.child.childId
  );
  const childName = useParentInfoStore(
    (state) => state.parentInfo?.child.name
  );
  const navigate = useNavigate();

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
    if (end) {
      setIsOpen(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const commonData = {
      startDate: startDate?.toISOString().split("T")[0] || "",
      endDate: endDate?.toISOString().split("T")[0] || "",
      childId: childId,
      childName: childName,
    };

    try {
      if (selectedOption === "dosage") {
        const dosageData: DosageData = {
          dosageId: formData.dosageId as number,
          confirmationStatus: formData.confirmationStatus as string,
          name: formData.name as string,
          volume: formData.volume as string,
          num: formData.num as string,
          times: formData.times as string,
          storageInfo: formData.storageInfo as string,
          details: formData.details as string,
          ...commonData,
        };
        console.log(dosageData);
        await createDosageDocument(dosageData, childId!);
      } else if (selectedOption === "absent") {
        const absentData: AbsentData = {
          absentId: formData.absentId as number,
          confirmationStatus: formData.confirmationStatus as string,
          reason: formData.reason as string,
          details: formData.details as string,
          ...commonData,
        };
        console.log(absentData);
        await createAbsentDocument(absentData, childId!);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    navigate("/document");
  };

  const handleDateClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col items-center flex-grow">
        <div className="flex flex-col items-center mt-10">
          <img
            src={daramgi}
            className="w-20 h-20 object-cover rounded-full"
            alt="프로필 이미지"
          />
          <p className="text-lg font-bold text-[#212121] mt-4">{childName}</p>
        </div>
        <div className="w-full max-w-md p-8 mt-4">
          <div className="mb-6">
            <div className="flex justify-center items-center mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  value="dosage"
                  checked={selectedOption === "dosage"}
                  onChange={handleOptionChange}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]"
                />
                투약
              </label>
              <label>
                <input
                  type="radio"
                  value="absent"
                  checked={selectedOption === "absent"}
                  onChange={handleOptionChange}
                  className="mr-2 focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]"
                />
                결석
              </label>
            </div>
            <div className="mb-4">
              <p className="text-base font-medium text-left text-[#353c4e] mb-2">
                기간 선택 <span className="text-red-600">*</span>
              </p>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                isOpen={isOpen}
                handleDateClick={handleDateClick}
                handleDateChange={handleDateChange}
              />
            </div>
            <InputFields
              formData={formData}
              handleInputChange={handleInputChange}
              selectedOption={selectedOption}
            />
            <div className="flex justify-center mt-10">
              <button
                className="w-24 h-12 bg-[#ffec8a] rounded-full flex items-center justify-center text-base font-medium text-[#212121] hover:bg-[#fdda6e] transition-colors"
                onClick={handleSubmit}
              >
                제출
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSubmitted && (
        <Modal message="제출이 완료되었습니다!" onClose={handleModalClose} />
      )}
    </div>
  );
};
