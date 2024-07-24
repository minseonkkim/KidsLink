interface AlbumChildProps{
    name: string;
    isFocus: boolean;
}

export default function AlbumChild({name, isFocus}:AlbumChildProps){
    return <>
        <span className={`${isFocus? 'bg-[#8CAD1E] text-[#fff]' : 'bg-[#EAEAEA] text-[#363636]'} cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px]`}>
            {name}
        </span>
    </>
}