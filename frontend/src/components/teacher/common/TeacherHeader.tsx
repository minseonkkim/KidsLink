// TeacherHeader.tsx
import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useModalStore from "../../../stores/teacher/ModalStore";
import ModalComponent from "../../../components/teacher/common/ModalComponent";
import LogoutButton from "../../logout/LogoutButton"; // 테스트용

interface Alert {
    time: string;
    title: string;
    content: string;
    isChecked: boolean;
}

const initialAlerts: Alert[] = [
    { time: '오후 2:21', title: "버스", content: "버스 도착", isChecked: false },
    { time: '오후 2:21', title: "상담", content: "김민선 학부모와 상담", isChecked: false },
    { time: '오후 2:21', title: "버스", content: "버스 도착", isChecked: false }
];

export default function TeacherHeader() {
    const { openModal, closeModal } = useModalStore();
    const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
    const location = useLocation();

    const deleteItem = (index: number) => {
        setAlertList(prevList => prevList.filter((_, i) => i !== index));
    };

    const openCreateModal = () => {
        openModal(
            <div className="w-[500px]">
                <h2 className="text-xl font-bold mb-4">알림 목록</h2>
                {alertList.length > 0 ? (
                    <ul>
                        {alertList.map((alert, index) => (
                            <div
                            key={index}
                            className="flex flex-col mb-1 p-4 rounded-2xl bg-white shadow-lg transition-transform duration-200 cursor-pointer"
                            onClick={() => deleteItem(index)}
                            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-gray-800">{alert.title}</span>
                              <span className="text-xs text-gray-600">{alert.time}</span>
                            </div>
                            <p className="text-gray-700">{alert.content}</p>
                          </div>
                        ))}
                    </ul>
                ) : (
                    <p>알림이 없습니다.</p>
                )}
            </div>
        );
    };

    // useEffect를 사용하여 alertList 변경 시 모달 내용 업데이트
    useEffect(() => {
        openCreateModal();
    }, [alertList]);

    // 페이지 이동 시 모달 닫기
    useEffect(() => {
        closeModal(); // 페이지 이동 시 모달 닫기
    }, [location, closeModal]);

    return (
        <>
            <header className="z-10 fixed top-0 w-full flex items-center justify-between h-[85px] bg-[#ffffff] shadow-md">
                <Link to='/'><p className="max-sm:ml-[30px] ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
                <LogoutButton /> 
                <div className="flex flex-row">
                    <CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} />
                    <div className="relative max-sm:mr-[30px] mr-[150px]" onClick={openCreateModal}>
                        <BiBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {alertList.filter(alert => !alert.isChecked).length}
                        </span>
                    </div>
                </div>
                <ModalComponent />
            </header>
        </>
    );
}