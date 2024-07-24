interface ChildCardProps {
    name: string;
    gender: string;
    age: number;
    absent: boolean;
    dosage: boolean;
    profileImgPath: string;
}

export default function ChildCard({ name, gender, age, absent, dosage, profileImgPath }: ChildCardProps) {
    return (
        <div className="w-[180px] h-[250px] m-2 relative drop-shadow-md">
            <div className="w-[180px] h-[250px] absolute inset-0 rounded-[10px] bg-[#fff9d7]" />
            <p className="w-[90px] absolute left-[45px] top-[170px] text-xl font-bold text-center text-[#363636]">
                {name}
            </p>
            <p className="w-[100px] absolute left-[40px] top-[190px] text-l mt-3 font-medium text-center text-[#363636]">
                {gender} / 만 {age}세
            </p>
            {absent && (
                <>
                    <div className="w-[60px] h-[30px] absolute left-[10px] top-[5px] rounded-[5px] bg-[#ffdfdf]" />
                    <p className="w-[50px] h-[25px] absolute left-[15px] top-[10px] text-s font-bold text-center text-[#363636]">
                        결석
                    </p>
                </>
            )}
            <div className="w-[100px] h-[100px] absolute left-[40px] top-[40px]">
                <img
                    src={profileImgPath}
                    className="w-[110px] h-[110px] mt-3 object-cover rounded-full"
                />
            </div>
            {dosage && (
                <>
                    <div className="w-[60px] h-[30px] absolute left-[110px] top-[5px] rounded-[5px] bg-[#e7dfff]" />
                    <p className="w-[50px] h-[25px] absolute left-[115px] top-[10px] text-s font-bold text-center text-[#363636]">
                        복용
                    </p>
                </>
            )}
        </div>
    );
}
