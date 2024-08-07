import { useEffect, useState } from "react";
import DocumentItem from "./DocumentItem";
import { checkDosageDocument, getDosageDocument } from "../../../api/document";

interface DosageDocumentProps {
    dosageId: number;
    onUpdate: () => void;
    isOurClass: boolean;
}

export default function DosageDocument({ dosageId, onUpdate, isOurClass }: DosageDocumentProps) {
    const [dosageDocument, setDosageDocument] = useState<any>(null); // Ensure any type to access all properties

    useEffect(() => {
        const fetchDosageDocument = async () => {
            try {
                const fetchedDosageDocument = await getDosageDocument(dosageId);
                setDosageDocument(fetchedDosageDocument);
            } catch (error) {
                console.error('Failed to fetch dosage document:', error);
            }
        }

        fetchDosageDocument();
    }, [dosageId]);

    const handleCheckboxClick = async () => {
        if (dosageDocument.confirmationStatus === "F") {
            try {
                await checkDosageDocument(dosageId);
                setDosageDocument({ ...dosageDocument, confirmationStatus: "T" });
                onUpdate(); // Update the parent component
            } catch (error) {
                console.error('Failed to check dosage document:', error);
            }
        }
    };

    const handleCheckboxChange = () => {
    };

    if (!dosageDocument) {
        return <div>Loading...</div>;
    }

    return (
        <div className="font-KoPubDotum w-[720px] h-[520px] rounded-[20px] bg-[#ffffff] p-8">
            <div className="flex flex-row justify-between">
                <span className="rounded-[10px] bg-[#E7DFFF] flex items-center justify-center w-[75px] h-[40px] font-bold text-[20px]">투약</span>
                {isOurClass === false &&
                <div className="flex flex-row items-center h-[30px]">
                    <input
                        type="checkbox"
                        className="mx-[3px] w-[20px] h-[20px] accent-[#363636]"
                        checked={dosageDocument.confirmationStatus === "T"}
                        disabled={dosageDocument.confirmationStatus === "T"}
                        onClick={handleCheckboxClick}
                        onChange={handleCheckboxChange}
                    />
                    <span className="font-bold text-[18px] mx-3">확인완료</span>
                </div>
                }
            </div>
            <div className="text-[20px] my-8">
                <DocumentItem title="기간" content={`${dosageDocument.startDate} ~ ${dosageDocument.endDate}`} />
                <DocumentItem title="약의 종류" content={dosageDocument.name} />
                <DocumentItem title="투약 용량" content={dosageDocument.volume} />
                <DocumentItem title="투약 횟수" content={dosageDocument.num} />
                <DocumentItem title="투약 시간" content={dosageDocument.times} />
                <DocumentItem title="보관 방법" content={dosageDocument.storageInfo} />
                <DocumentItem title="특이사항" content={dosageDocument.details} />
            </div>
        </div>
    );
}
