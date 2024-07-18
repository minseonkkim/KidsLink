interface MenuButtonProps {
    name: string;
    imgpath: string;
  }

export default function MenuButton({name, imgpath}: MenuButtonProps){
    return <>
        <div className="cursor-pointer flex flex-col items-center justify-center w-[200px] h-[200px] rounded-[20px] bg-[#fff9d7] m-[20px] hover:bg-[#F6F0CF]">
            <img src={imgpath} className="h-[110px] m-1"/>
            <p className="text-[27px] font-bold text-center text-[#363636] m-1">
                {name}
            </p>
        </div>
    </>
}