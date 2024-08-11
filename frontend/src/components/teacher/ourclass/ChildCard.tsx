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
            <div className="relative" style={{ width: window.innerWidth < 1024 ? '330px' : 'auto' }}>
                <AbsentDocument absentId={absentId[index]} onUpdate={() => {}} isOurClass={true}/>
                {absentId.length > 1 && (
                    <div className="w-full h-[40px]">
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
                    </div>
                )}
            </div>
        );
    };

    const openDosageModal = (index: number) => {
        setCurrentDosageIndex(index);
        openModal(
            <div className="relative" style={{ width: window.innerWidth < 1024 ? '330px' : 'auto' }}>
                <DosageDocument dosageId={dosageId[index]} onUpdate={() => {}} isOurClass={true}/>
                {dosageId.length > 1 && (
                    <div className="w-full h-[40px]">
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
                    </div>
                )}
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
        <div className="w-[125px] lg:w-[180px] h-[190px] lg:h-[250px] lg:mx-[20px] mx-1 my-4 relative drop-shadow-md rounded-[10px] bg-[#fff9d7]">
            <p className="w-[90px] absolute lg:left-[45px] lg:top-[170px] left-[19px] top-[128px] text-xl font-bold text-center text-[#363636]">
                {name}
            </p>
            <p className="w-[100px] absolute lg:left-[40px] lg:top-[190px] left-[10px] top-[146px] text-l mt-3 font-medium text-center text-[#363636]">
                {gender === "M" ? "남자" : "여자"} / 만 {age}세
            </p>
            {absent && (
                <div onClick={() => openAbsentModal(0)}
                className="lg:w-[60px] h-[30px] w-[48px] absolute lg:left-[10px] lg:top-[10px] left-[3px] top-[8px] rounded-[5px] bg-[#ffdfdf] cursor-pointer flex justify-center items-center font-bold">
                    결석
                </div>
            )}
            <div className="lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] absolute lg:left-[40px] lg:top-[40px] top-[30px] left-[25px]">
                <img
                    src={profileImgPath}
                    className="lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] mt-3 object-cover rounded-full"
                />
            </div>
            {dosage && (
                <div onClick={() => openDosageModal(0)} 
                className="cursor-pointer lg:w-[60px] h-[30px] w-[48px] absolute lg:right-[10px] lg:top-[10px] right-[3px] top-[8px] rounded-[5px] bg-[#e7dfff] flex justify-center items-center font-bold">
                    투약
                </div>
            )}
            <Modal/>
        </div>
    );
}
