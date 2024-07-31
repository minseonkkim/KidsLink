import { ImCheckboxChecked } from "react-icons/im";

interface DocumentChildProps {
    type: string;
    name: string;
    profileImgPath: string;
    finish: string;
}

export default function DocumentChild({type, name, profileImgPath, finish}: DocumentChildProps){
    const currentChild = true;
    return <>
        <div className={`flex flex-row items-center bg-[#ffffff] px-5 py-2 w-full h-full rounded-[15px]`}>
            <span className={`rounded-[10px] ${type==='Dosage' ? 'bg-[#E7DFFF]' : 'bg-[#FFDFDF]'} flex items-center justify-center w-[70px] h-[38px] font-bold text-[18px]`}>{type === "Absent" ? "결석" : "투약"}</span>
            <div className="w-[47px] h-[47px] ml-5">
                <img src={profileImgPath} className="w-full h-full rounded-full object-cover"  />
            </div>
            <div className="font-bold mx-3 text-[21px]">{name}</div>
            {finish == "T" && <ImCheckboxChecked className="mx-[10px] w-[20px] h-[20px]"/>}
        </div>
    </>
}