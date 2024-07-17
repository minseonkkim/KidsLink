import daramgi from '../../../assets/parent/home/daramgi.png';


export default function Desc() {
  return (
    <div className="w-[393px] h-[289px] absolute left-[42px] top-[94px]">
        <img
        src={daramgi}
        alt='daramgi'
        className="w-[179px] h-[289px] absolute left-[213px] top-[-1px] object-cover transition duration-300 transform hover:scale-110"
        />
        <div className="w-[214px] h-24 absolute left-0 top-[60px]">
        <p className="w-[210px] absolute left-px top-11 text-[31px] font-medium text-left text-[#212121]">
            만나서 반가워요!
        </p>
        <p className="w-[214px] absolute left-0 top-0 text-[31px] text-left text-[#212121]">
            <span className="w-[214px] text-[31px] font-bold text-left text-[#212121]">김민선 </span>
            <span className="w-[214px] text-[31px] font-medium text-left text-[#212121]">학부모님</span>
        </p>
        </div>
    </div>
  );
};

