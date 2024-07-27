import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useModal from "../../../hooks/teacher/useModal";
import { FaRegTrashAlt } from "react-icons/fa";

interface Alert {
    time: string;
    content: string;
    isChecked: boolean;
}

const initialAlerts: Alert[] = [
    { time: '오후 14:25', content: "김민선 학부모로부터 투약 서류가 도착했습니다.", isChecked: false },
    { time: '오후 14:21', content: "2024.08.05 16:00 김민선 학부모와 상담이 예약되었습니다.", isChecked: false },
    { time: '오전 10:40', content: "사진 분류가 완료되었습니다.", isChecked: true }
];

export default function TeacherHeader() {
    const { openModal, closeModal, Modal, isModalOpen } = useModal();
    const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);

    const deleteItem = (index: number) => {
        setAlertList(prevList => prevList.filter((_, i) => i !== index));
    };

    const deleteAllItems = () => {
        setAlertList([]);
    };

    const renderModalContent = () => (
        <div className="w-[550px] max-h-[530px] p-2">
                <div className="flex flex-row justify-between">
                    <div className="text-[23px] font-bold mb-4">알림 목록</div>
                    {alertList.length > 0 && 
                        <button
                            className="mb-4 px-3.5 py-2 rounded-lg flex flex-row items-center bg-[#DF6767] text-white"
                            onClick={deleteAllItems}
                        >
                            <FaRegTrashAlt className="mr-2 text-[16px] font-bold"/>
                            전체 삭제
                        </button>
                    }
                </div>
                
                {alertList.length > 0 ? (
                    <div>
                        <ul>
                            {alertList.map((alert, index) => (
                                <div
                                    key={index}
                                    className="flex flex-row justify-between items-center my-5"
                                >
                                    <div>
                                        <p className={`${alert.isChecked? 'text-[#B8B8B8]' : 'text-[#363636]'} text-[17px] mb-1`}>{alert.content}</p>
                                        <span className={`${alert.isChecked? 'text-[#B8B8B8]' : 'text-gray-600'} text-[14px]`}>{alert.time}</span>
                                    </div>
                                    <FaRegTrashAlt className="text-[18px] cursor-pointer"
                                        onClick={() => deleteItem(index)}
                                        />
                                </div>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>알림이 없습니다.</p>
                )}
            </div>
    );

    useEffect(() => {
        if (isModalOpen) {
            closeModal();
            openModal(renderModalContent());
        }
    }, [alertList, isModalOpen]);

    const openCreateModal = () => {
        if (!isModalOpen) {
            openModal(renderModalContent());
        }
    };

    return (
        <>
            <header className="z-10 fixed top-0 w-full flex items-center justify-between h-[85px] bg-[#ffffff] shadow-md">
                <Link to='/'><p className="max-sm:ml-[30px] ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
                <div className="flex flex-row">
                    <Link to='/mypage'><CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} /></Link>
                    <div className="relative max-sm:mr-[30px] mr-[150px]" onClick={openCreateModal}>
                        <BiBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {alertList.filter(alert => !alert.isChecked).length}
                        </span>
                    </div>
                </div>
                <Modal />
            </header>
            <Modal />
        </>
    );
}
