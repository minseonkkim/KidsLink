import { useState } from "react";
import useModal from "../../../hooks/teacher/useModal";
import AbsentDocument from "../document/AbsentDocument";
import DosageDocument from "../document/DosageDocument";

interface ChildCardProps {
    name: string;
    gender: string;
    age: number;
    absent: boolean;
    dosage: boolean;
    absentId: number[];
    dosageId: number[];
    profileImgPath: string;
}

export default function ChildCard({ name, gender, age, absent, dosage, profileImgPath, absentId, dosageId }: ChildCardProps) {
    const { openModal, Modal, isModalOpen, closeModal } = useModal();
    const [currentDosageIndex, setCurrentDosageIndex] = useState(0);
    const [currentAbsentIndex, setCurrentAbsentIndex] = useState(0);

    const openAbsentModal = (index: number) => {
        setCurrentAbsentIndex(index);
        openModal(
            <div className="relative">
                <AbsentDocument absentId={absentId[index]} onUpdate={() => {}} isOurClass={true}/>
                <div className="w-full h-[40px]">
                    {absentId.length > 1 && (
                    <div className="flex justify-between">
                        <span
                            onClick={previousAbsent}
                            className={`cursor-pointer text-2xl ml-8 ${index === 0 ? 'invisible' : ''}`}
                            style={{ position: 'absolute', left: 0 }}
                        >
                            &#9664; {/* Left arrow icon */}
                        </span>
                        <span
                            onClick={nextAbsent}
                            className={`cursor-pointer text-2xl mr-8 ${index === absentId.length - 1 ? 'invisible' : ''}`}
                            style={{ position: 'absolute', right: 0 }}
                        >
                            &#9654; {/* Right arrow icon */}
                        </span>
                    </div>
                )}
                </div>
                
            </div>
        );
    };

    const openDosageModal = (index: number) => {
        setCurrentDosageIndex(index);
        openModal(
            <div className="relative">
                <DosageDocument dosageId={dosageId[index]} onUpdate={() => {}} isOurClass={true}/>
                <div className="w-full h-[40px]">
                    {dosageId.length > 1 && (
                        <div className="flex justify-between mt-4">
                            <span
                                onClick={previousDosage}
                                className={`cursor-pointer text-2xl ml-8 ${index === 0 ? 'invisible' : ''}`}
                                style={{ position: 'absolute', left: 0 }}
                            >
                                &#9664; {/* Left arrow icon */}
                            </span>
                            <span
                                onClick={nextDosage}
                                className={`cursor-pointer text-2xl mr-8 ${index === dosageId.length - 1 ? 'invisible' : ''}`}
                                style={{ position: 'absolute', right: 0 }}
                            >
                                &#9654; {/* Right arrow icon */}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const nextAbsent = () => {
        const newIndex = currentAbsentIndex + 1 < absentId.length ? currentAbsentIndex + 1 : currentAbsentIndex;
        setCurrentAbsentIndex(newIndex);
        openAbsentModal(newIndex);
    };

    const previousAbsent = () => {
        const newIndex = currentAbsentIndex - 1 >= 0 ? currentAbsentIndex - 1 : currentAbsentIndex;
        setCurrentAbsentIndex(newIndex);
        openAbsentModal(newIndex);
    };

    const nextDosage = () => {
        const newIndex = currentDosageIndex + 1 < dosageId.length ? currentDosageIndex + 1 : currentDosageIndex;
        setCurrentDosageIndex(newIndex);
        openDosageModal(newIndex);
    };

    const previousDosage = () => {
        const newIndex = currentDosageIndex - 1 >= 0 ? currentDosageIndex - 1 : currentDosageIndex;
        setCurrentDosageIndex(newIndex);
        openDosageModal(newIndex);
    };

    return (
        <div className="w-[200px] h-[250px] m-2 relative drop-shadow-md">
            <div className="w-[180px] h-[250px] absolute inset-0 rounded-[10px] bg-[#fff9d7]" />
            <p className="w-[90px] absolute left-[45px] top-[170px] text-xl font-bold text-center text-[#363636]">
                {name}
            </p>
            <p className="w-[100px] absolute left-[40px] top-[190px] text-l mt-3 font-medium text-center text-[#363636]">
                {gender === "M" ? "남자" : "여자"} / 만 {age}세
            </p>
            {absent && (
                <div onClick={() => openAbsentModal(0)}
                className="w-[60px] h-[30px] absolute left-[10px] top-[10px] rounded-[5px] bg-[#ffdfdf] cursor-pointer flex justify-center items-center font-bold">
                    결석
                </div>
            )}
            <div className="w-[100px] h-[100px] absolute left-[40px] top-[40px]">
                <img
                    src={profileImgPath}
                    className="w-[110px] h-[110px] mt-3 object-cover rounded-full"
                />
            </div>
            {dosage && (
                <div onClick={() => openDosageModal(0)} 
                className="cursor-pointer w-[60px] h-[30px] absolute left-[110px] top-[10px] rounded-[5px] bg-[#e7dfff] flex justify-center items-center font-bold">
                    투약
                </div>
            )}
            <Modal/>
        </div>
    );
}
