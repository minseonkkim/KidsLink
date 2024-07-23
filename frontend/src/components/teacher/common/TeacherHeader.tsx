import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { Link } from "react-router-dom";
import useModal from "../../../hooks/teacher/useModal";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";

export default function TeacherHeader(){
    const {openModal, Modal} = useModal();
    const [alerts, setAlerts] = useState([
        { id: 1, alertCategory: "버스", content: "버스 도착", isChecked: false },
        { id: 2, alertCategory: "상담", content: "김민선 학부모와 상담", isChecked: false },
        { id: 3, alertCategory: "버스", content: "버스 도착", isChecked: true }
    ]);

    const deleteItem = (id: number) => {
        console.log(id)
        setAlerts(alerts.filter(alert => alert.id !== id));
    };


    const openCreateModal = () => {
        openModal(
            <div className="w-[500px]">
                <h2 className="text-xl font-bold mb-4">알림 목록</h2>
                <ul>
                {alerts.map(alert => (
                    <li key={alert.id} className={`mb-2 p-2 border rounded ${alert.isChecked ? "bg-[#e2e8f0]" : "bg-transparent"}`}>
                    <p className="font-bold">{alert.alertCategory}</p>
                    <p>{alert.content}</p>
                    <p>{alert.isChecked ? '확인됨' : '미확인'}</p>
                    <button onClick={() => deleteItem(alert.id)} className="text-red-500 hover:text-red-700">
                        <FaXmark />
                    </button>
                  </li>
                ))}
                </ul>
            </div>
        );
    };

    return <>
        <div className="flex items-center justify-between h-[85px] bg-[#ffffff] relative shadow-md z-10">
            <Link to='/'><p className="max-sm:ml-[30px] ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
            <div className="flex flex-row">
                <CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} />
                <div className="relative max-sm:mr-[30px] mr-[150px]" onClick={openCreateModal}>
                    <BiBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
                </div>
            </div>
        </div>
        <Modal />
    </>
}