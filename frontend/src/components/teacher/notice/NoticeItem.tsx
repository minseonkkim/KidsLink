import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import useModal from "../../../hooks/teacher/useModal";

interface NoticeItemProps {
    id: number;
    title: string;
    date: string;
    content: string;
}

export default function NoticeItem({title, date, content}: NoticeItemProps){
    const [expanded, setExpanded] = useState(false);
    const { openModal, Modal } = useModal();

    const goToDetail = () => {
        setExpanded(!expanded);
    }

    const openUpdateModal = () => {
        openModal(
            <div className="w-[500px]">
                <form>
                    <div className="mb-4 flex flex-row items-center">
                        <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">날짜</label>
                        <input type="date" className="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#FDDA6E]" />
                    </div>
                    <div className="mb-4 flex flex-row">
                        <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">제목</label>
                        <input className="border border-gray-300 p-2 rounded w-full" />
                    </div>
                    
                    <div className="mb-4 flex flex-row">
                        <label className="block mr-3 mb-1 font-bold whitespace-nowrap text-[18px]">내용</label>
                        <textarea className="border border-gray-300 p-2 rounded w-full" rows={10}></textarea>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="w-[70px] h-[38px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[8px] hover:bg-[#D4DDEA]">수정</button>
                    </div>
                </form>
            </div>
        );
    }

    return <>
        
        <div onClick={goToDetail} className={`flex flex-row justify-between items-center rounded-[15px] w-full ${expanded ? 'bg-[#F8FBF3]' : 'h-[92px] bg-[#fff] '} border-[1px] my-5 p-5 overflow-hidden hover:bg-[#F8FBF3] cursor-pointer`}>
            <div className="w-[1100px]">
                <div className="flex flex-row justify-between">
                    <div className="font-bold text-[21px] mb-2 flex flex-row">
                        <p className="text-[#8CAD1E]">[{date}]</p>&nbsp;
                        <p>{title}</p>
                    </div>
                    {expanded ? 
                        <div className="flex flex-row items-center">
                            <button onClick={openUpdateModal} className="mr-3 border-[2px] bg-[#fff] px-2 py-1 rounded-[10px]">수정하기</button>
                            <IoIosArrowUp />
                        </div>
                        : <IoIosArrowDown />}
                </div>
                
                <div className={` ${expanded? 'whitespace-pre-line' : 'text-ellipsis overflow-hidden whitespace-nowrap'} text-[15px]`}>{content}</div>
            </div>
        </div>
        <Modal/>
    </>
}