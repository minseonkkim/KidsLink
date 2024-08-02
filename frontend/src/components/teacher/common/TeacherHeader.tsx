import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useModal from "../../../hooks/teacher/useModal";
import { FaRegTrashAlt } from "react-icons/fa";
import { getAlarmCount, getAllAlarms } from "../../../api/alarm";

interface Alarm{
    id: number;
    contents: string;
    date: string;
    code: string;
  }



export default function TeacherHeader() {
    const { openModal, closeModal, Modal, isModalOpen } = useModal();
    const [alertList, setAlertList] = useState<Alarm[]>([]);
    const [alertNum, setAlertNum] = useState(0);

    const fetchAlarmList = async () => {
        const fetchedAlarmList = await getAllAlarms();
        const sortedAlarmList = fetchedAlarmList.sort((a, b) => b.id - a.id);
        setAlertList(sortedAlarmList);
    }

    useEffect(() => {
        fetchAlarmList();
    }, [])
 
    const deleteItem = (index: number) => {
        setAlertList(prevList => prevList.filter((_, i) => i !== index));
    };

    const deleteAllItems = () => {
        setAlertList([]);
    };

    let navigate = useNavigate();

    const handleClick = (code: string) => {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            if (code === "DOCUMENT") {
                navigate('/document');
            } else if (code === "MEETING") {
                navigate('/meeting');
            } else {
                navigate('/');
            }
        };
    };

    const renderModalContent = (alertList: Alarm[]) => (

        <div className="w-[550px] max-h-[450px] p-2 custom-scrollbar">
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
                            {alertList.map((alert, index) => (
                                <div
                                    key={index}
                                    className="flex flex-row justify-between items-center my-5 cursor-pointer"
                                    onClick={handleClick(alert.code)}
                                >
                                    <div>
                                        <p className="text-[17px] mb-[1px]">{alert.contents}</p>
                                        <span className="text-[#B8B8B8] text-[13px]">{alert.date}</span>
                                    </div>
                                    <FaRegTrashAlt className="text-[18px] cursor-pointer"
                                        onClick={() => deleteItem(index)}
                                        />
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>알림이 없습니다.</p>
                )}
            </div>
    );

    const fetchAlarmCount = async () => {
        setAlertNum(await getAlarmCount());
    }

    useEffect(() => {
        if (isModalOpen) {
            closeModal();
            fetchAlarmCount();
            openModal(renderModalContent(alertList));
        }
    }, [alertList, isModalOpen]);

    const openAlarmModal = () => {
        if (!isModalOpen) {
            fetchAlarmList();
            openModal(renderModalContent(alertList));
        }
    };

    useEffect(() => {
        fetchAlarmCount();
    }, [])

    return (
        <>
            <header className="z-10 fixed top-0 w-full flex items-center justify-between h-[85px] bg-[#ffffff] shadow-md">
                <Link to='/'><p className="max-sm:ml-[30px] ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
                <div className="flex flex-row">
                    <Link to='/mypage'><CgProfile className="w-[30px] h-[30px] mr-8 cursor-pointer" style={{ color: '#363636' }} /></Link>
                    <div className="relative max-sm:mr-[30px] mr-[150px]" onClick={openAlarmModal}>
                        <BiBell className="w-[30px] h-[30px] cursor-pointer" style={{ color: '#363636' }} />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {alertNum}
                        </span>
                    </div>
                </div>
                <Modal />
            </header>
            <Modal />
        </>
    );
}
