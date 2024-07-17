import DocumentItem from "./DocumentItem";
import { ImCheckboxChecked } from "react-icons/im";

export default function AbsentDocument(){
    return <>
        <div className="font-KoPubDotum w-[720px] h-[520px] rounded-[20px] bg-[#ffffff] border-[#B2D170] border-[3px] p-8">
            <div className="flex flex-row justify-between">
                <span className="rounded-[10px] bg-[#FFDFDF] flex items-center justify-center w-[75px] h-[40px] font-bold text-[20px]">결석</span>
                <div className="flex flex-row items-center h-[30px]">
                    <ImCheckboxChecked/>
                    <span className="font-bold text-[18px] mx-3">확인완료</span>
                </div>
            </div>
            <div className="text-[20px] my-8">
                <DocumentItem title="기간" content="2024.07.04 ~ 2024.07.05"/>
                <DocumentItem title="사유" content="다리부상"/>
                <DocumentItem title="기타사항" content=""/>
            </div>
        </div>
    </>
}