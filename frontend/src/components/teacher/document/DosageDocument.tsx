import DocumentItem from "./DocumentItem";

export default function DosageDocument(){
    return <>
        <div className="font-KoPubDotum w-[720px] h-[520px] rounded-[20px] bg-[#ffffff] border-[#B2D170] border-[3px] p-8">
            <div className="flex flex-row justify-between">
                <span className="rounded-[10px] bg-[#E7DFFF] flex items-center justify-center w-[75px] h-[40px] font-bold text-[20px]">투약</span>
                <div className="flex flex-row items-center h-[30px]">
                    <input
                        type="checkbox"
                        className="mx-[3px] w-[20px] h-[20px] accent-[#363636]"
                    />
                    <span className="font-bold text-[18px] mx-3">확인완료</span>
                </div>
            </div>
            <div className="text-[20px] my-8">
                <DocumentItem title="기간" content="2024.07.10 ~ 2024.07.14"/>
                <DocumentItem title="약의 종류" content="감기약"/>
                <DocumentItem title="투약 용량" content=""/>
                <DocumentItem title="투약 횟수" content="2회"/>
                <DocumentItem title="투약 시간" content="09:00, 13:00"/>
                <DocumentItem title="보관 방법" content=""/>
                <DocumentItem title="특이사항" content=""/>
            </div>
        </div>
    </>
}