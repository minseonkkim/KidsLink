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
        <div className="w-[241px] h-[338px] m-4 relative">
            <div className="w-[241px] h-[338px] absolute inset-0 rounded-[15px] bg-[#fff9d7]" />
            <p className="w-[93px] absolute left-[74px] top-[217px] text-3xl font-bold text-center text-[#363636]">
                {name}
            </p>
            <p className="w-[111px] absolute left-[65px] top-[278px] text-xl font-medium text-center text-[#363636]">
                {gender} / 만 {age}세
            </p>
            {absent && (
                <>
                    <div className="w-[74px] h-9 absolute left-[23px] top-[13px] rounded-[10px] bg-[#ffdfdf]" />
                    <p className="w-[55px] h-[30px] absolute left-[34px] top-[17px] text-xl font-bold text-center text-[#363636]">
                        결석
                    </p>
                </>
            )}
            <div className="w-[140px] h-[140px] absolute left-[51px] top-[67px]">
                <img
                    src={profileImgPath}
                    className="w-[140px] h-[140px] object-cover rounded-full"
                />
            </div>
            {dosage && (
                <>
                    <div className="w-[74px] h-9 absolute left-[145px] top-[13px] rounded-[10px] bg-[#e7dfff]" />
                    <p className="w-[49px] h-[30px] absolute left-[158px] top-[17px] text-xl font-bold text-center text-[#363636]">
                        복용
                    </p>
                </>
            )}
        </div>
    );
}
