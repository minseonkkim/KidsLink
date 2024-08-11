import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { formatDate } from "../../../utils/teacher/formatDate";

interface NoticeItemProps {
    id: number;
    title: string;
    date: string;
    content: string;
}

export default function NoticeItem({title, date, content}: NoticeItemProps){
    const [expanded, setExpanded] = useState(false);

    const goToDetail = () => {
        setExpanded(!expanded);
    }

    return <>
        
        <div onClick={goToDetail} className={`flex flex-row justify-between items-center rounded-[15px] w-full ${expanded ? 'bg-[#F8FBF3]' : 'lg:h-[92px] h-[130px] bg-[#fff] '} border-[1px] my-5 p-5 overflow-hidden hover:bg-[#F8FBF3] cursor-pointer`}>
            <div className="lg:w-[1100px] w-full">
                <div className="flex flex-row justify-between">
                    <div className="font-bold text-[21px] mb-2 flex lg:flex-row flex-col whitespace-nowrap">
                        <p className="text-[#8CAD1E]">[{formatDate(date)}]&nbsp;</p>
                        <p>{title}</p>
                    </div>
                    {expanded ?  <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                
                <div className={` ${expanded? 'whitespace-pre-line' : 'text-ellipsis overflow-hidden whitespace-nowrap'} text-[15px]`}>{content}</div>
            </div>
        </div>
    </>
}