import { FaMinusCircle } from "react-icons/fa";

interface Image {
    path: string;
    id: number;
}

interface AlbumChildProps {
    name?: string;
    isFocus: boolean;
    images: Image[];
}

export default function AlbumChild({ name, isFocus, images }: AlbumChildProps) {
    return (
        <div className="flex flex-row w-full">
            <span className={`${name !== "분류실패" ? 'bg-[#8CAD1E] text-[#fff]' : 'bg-[#EAEAEA] text-[#363636]'} cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px]`}>
                {name}
            </span>
            <div className={`${name !== "분류실패" ? 'border-[#8CAD1E]' : 'border-[#EAEAEA]'} p-3 mb-2 w-full grid grid-cols-7 gap-4 overflow-y-auto rounded-[10px] border-[2px]`}>
                {images.map((item, index) => (
                    <div key={index} className="relative w-full h-32">
                        <img src={item.path} className="object-cover w-full h-full rounded-md" />
                        <button 
                            className="absolute top-1 right-1 bg-red-600 text-white p-[2px] rounded-full"
                        >
                            <FaMinusCircle size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
