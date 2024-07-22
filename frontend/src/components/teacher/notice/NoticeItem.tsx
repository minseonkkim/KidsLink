import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

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
        
        <div onClick={goToDetail} className={`flex flex-row justify-between items-center rounded-[15px] w-full ${expanded ? 'bg-[#F8FBF3]' : 'h-[92px] bg-[#fff] '} border-[1px] my-5 p-5 overflow-hidden hover:bg-[#F8FBF3] cursor-pointer`}>
            <div className="w-[1100px]">
                <div className="flex flex-row justify-between">
                    <div className="font-bold text-[21px] mb-2 flex flex-row">
                        <p className="text-[#8CAD1E]">[{date}]</p>&nbsp;
                        <p>{title}</p>
                    </div>
                    {expanded ? 
                        <div className="flex flex-row items-center">
                            <button className="mr-3 border-[2px] bg-[#fff] px-2 py-1 rounded-[10px]">수정하기</button>
                            <IoIosArrowUp />
                        </div>
                        : <IoIosArrowDown />}
                </div>
                
                <div className={` ${expanded? 'whitespace-pre-line' : 'text-ellipsis overflow-hidden whitespace-nowrap'} text-[15px]`}>{content}</div>
            </div>
        </div>
    </>
}