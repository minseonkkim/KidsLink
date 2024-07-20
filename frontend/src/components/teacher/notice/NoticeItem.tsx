interface NoticeItemProps {
    title: string;
    date: string;
    content: string;
}

export default function NoticeItem({title, date, content}: NoticeItemProps){
    return <>
        <div className="flex flex-row justify-between items-center rounded-[15px] w-full h-[92px] bg-[#fff] border-[1px] my-5 p-5 overflow-hidden hover:bg-[#F8FBF3] cursor-pointer">
            <div className="w-[1100px]">
                <div className="font-bold text-[21px] mb-2 flex flex-row">
                    <p className="text-[#8CAD1E]">[{date}]</p>&nbsp;
                    <p>{title}</p>
                </div>
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-[15px]">{content}</div>
            </div>
        </div>
    </>
}