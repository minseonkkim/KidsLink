interface MenuButtonProps {
    name: string;
    imgpath: string;
}

export default function MenuButton({ name, imgpath }: MenuButtonProps) {
    return (
        <>
            <div className="drop-shadow-md cursor-pointer flex flex-col items-center justify-center w-[200px] h-[200px] max-sm:w-[130px] max-sm:h-[130px] rounded-[20px] bg-[#fff9d7] m-[25px] max-sm:m-[12px] hover:bg-[#F6F0CF] group">
                <img src={imgpath} className="h-[110px] max-sm:h-[65px] m-3 transition-transform duration-300 group-hover:scale-110"/>
                <p className="text-[25px] max-sm:text-[20px] font-bold text-center text-[#363636] m-1 transition-transform duration-300 group-hover:scale-110">
                    {name}
                </p>
            </div>
        </>
    );
}
