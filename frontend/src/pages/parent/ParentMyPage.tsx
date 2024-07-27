import { ChangeEvent, useState } from "react";
import ParentHeader from "../../components/parent/common/HomeHeader";
import { IoLogOutOutline } from "react-icons/io5";
import profileImg from "../../assets/parent/daramgi.png";
import ChildImg from "../../assets/teacher/profile_img.jpg"

export default function ParentMyPage() {
  const [currentProfileImg, setCurrentProfileImg] = useState(profileImg);

  const handleProfileImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCurrentProfileImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-[#FFEC8A]">
        <ParentHeader />
        <div className="w-full h-[807px] absolute left-0 top-[93px]">
          <div className="w-full h-full absolute left-0 top-0 rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-5">
            <div className="mt-3 text-[17px] flex flex-row justify-end items-center py-3 px-1">
              <IoLogOutOutline className="mr-1" /> 로그아웃
            </div>
            <div className="h-[1px] bg-[#B8B8B8]" />
            <div className="flex flex-col items-center mt-5 mb-1">
                <div className="relative mb-3">
                    <img
                        src={currentProfileImg}
                        className="w-[160px] h-[160px] rounded-full object-cover"
                    />
                    {/* <label className="absolute bottom-4 left-[-10px] flex flex-row items-center px-3 py-1 bg-white text-black text-[17px] border-[#757575] border-[1px] rounded-md cursor-pointer">
                    수정
                    <input
                    type="file"
                    onChange={handleProfileImgChange}
                    className="hidden"
                    /> 
                </label>*/}
                </div>
            </div>
            <div className="font-bold text-[20px] text-center mb-1">
                밤밤수 학부모
            </div>
            <div className="flex justify-center">
                <button className="drop-shadow-md border rounded-[20px] px-2 py-1 bg-[#f4f4f4]">내 정보</button>
            </div>
            <div className="h-[1px] bg-[#B8B8B8] mt-5" />
            <div className="text-[17px] my-2">아이 정보</div>
            <div className="rounded-[10px] bg-[#FFF9D7] w-full p-5 flex flex-row">
                    <img
                        src={ChildImg}
                        className="w-[100px] h-[100px] rounded-full object-cover"
                    />
                    <div className="flex flex-col justify-center items-center flex-grow">
                        <div className="mb-1">싸피유치원 햇님반</div>
                        <div className="font-bold text-[18px]">밤밤수</div>
                    </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
