import React from 'react';

interface InputFieldsProps {
  formData: { [key: string]: string | number };
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  selectedOption: string;
}

export default function InputFields({
  formData,
  handleInputChange,
  selectedOption,
}: InputFieldsProps) {
  const fields =
    selectedOption === "dosage"
      ? ["name", "volume", "num", "times", "storageInfo", "details"]
      : ["reason", "details"];

  return (
    <>
      {fields.map((label, index) => (
        <div className="mb-4" key={index}>
          <p className="text-base font-medium text-left text-[#353c4e] mb-2">
            {label === "name" ? (
              <>
                약의 종류 <span className="text-red-600">*</span>
              </>
            ) : label === "volume" ? (
              "투약 용량"
            ) : label === "num" ? (
              "투약 횟수"
            ) : label === "times" ? (
              "투약 시간"
            ) : label === "storageInfo" ? (
              "보관 방법"
            ) : label === "details" ? (
              "특이 사항"
            ) : label === "reason" ? (
              <>
                사유 <span className="text-red-600">*</span>
              </>
            ) : (
              "기타 사항"
            )}
          </p>
          {label === "details" ? (
            <textarea
              name={label}
              value={formData[label] || ""}
              className="w-full p-2 border rounded"
              onChange={handleInputChange}
            ></textarea>
          ) : (
            <input
              type="text"
              name={label}
              value={formData[label] || ""}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FDDA6E]"
              onChange={handleInputChange}
            />
          )}
        </div>
      ))}
    </>
  );
}
