interface MemberCardProps {
    role: string,
    img: string,
    isSelected: boolean;
    onClick: () => void;
}

export default function MemberCard({role, img,isSelected, onClick}: MemberCardProps) {
    return (
        <div
            className={`w-[300px] h-[150px] flex flex-row items-center justify-center rounded-[20px] bg-gradient-to-r from-[#fff9d7] via-[#ebefc6] to-[#d5e4b4] shadow-md transition-transform transform hover:scale-105 cursor-pointer ${isSelected ? 'border-4 border-green-500' : ''}`}
            onClick={onClick}
        >
            <img
                src={img}
                className="w-[100px] h-[100px] rounded-full object-cover mr-4"
            />
            <p className="text-[20px] font-bold text-center text-[#363636]">
                {role}
            </p>
        </div>
    );
}