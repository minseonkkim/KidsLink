import { ImCheckboxChecked } from "react-icons/im";

interface ChildProps {
    currentChild: boolean;
    type: string;
    name: string;
    profileImgPath: string;
    finish: boolean;
}

export default function Child({currentChild, type, name, profileImgPath, finish}: ChildProps){
    return <>
        <div className={`font-KoPubDotum flex flex-row items-center rounded-[15px] border-[#B2D170] ${currentChild===true? 'border-[3px]': 'border-none'} w-[320px] h-[100px] bg-[#ffffff] px-5 py-2 m-[10px] cursor-pointer`}>
            <span className={`rounded-[10px] ${type==='투약' ? 'bg-[#E7DFFF]' : 'bg-[#FFDFDF]'} flex items-center justify-center w-[70px] h-[38px] font-bold text-[18px]`}>{type}</span>
            <div className="w-[47px] h-[47px] ml-5">
                <img src={profileImgPath} className="w-full h-full rounded-full object-cover"  />
            </div>
            <div className="font-bold mx-3 text-[21px]">{name}</div>
            {finish && <ImCheckboxChecked className="mx-[10px] w-[20px] h-[20px]"/>}
        </div>
    </>
}