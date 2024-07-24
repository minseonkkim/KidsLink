import AlbumChild from "../../components/teacher/album/AlbumChild";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { BsSend } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import ExampleImg from "../../assets/teacher/example_img_1.jpg"

export default function TeacherAlbumFinish(){
    return <>
        <TeacherHeader/>
        <div className="mt-[120px] px-[150px]">
            <NavigateBack backPage="홈" backLink='/'/>
            <Title title="사진분류"/>
            <button className="absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center">
                    <BsSend className="mr-2" />학부모에게 전송하기
                </button>
            <div className="flex flex-wrap justify-center mx-[180px]">
                <AlbumChild name="전체보기" isFocus={true}/>
                <AlbumChild name="김민선" isFocus={false}/>
                <AlbumChild name="김범수" isFocus={false}/>
                <AlbumChild name="김여준" isFocus={false}/>
                <AlbumChild name="김지원" isFocus={false}/>
                <AlbumChild name="이상민" isFocus={false}/>
                <AlbumChild name="정현수" isFocus={false}/>
                <AlbumChild name="김싸피" isFocus={false}/>
                <AlbumChild name="김짱구" isFocus={false}/>
                <AlbumChild name="김범수" isFocus={false}/>
                <AlbumChild name="김범수" isFocus={false}/>
            </div>
            <div className="flex flex-col justify-center items-center mb-3">
              <div className="grid grid-cols-7 gap-4 overflow-y-auto h-[408px] border-[#B2D170] border-[1px] mt-10 rounded-[10px] content-start p-3">
                {/* {images.map((image, index) => ( */}
                  <div className="relative w-32 h-32">
                    <img src={ExampleImg} className="object-cover w-full h-full rounded-md" />
                    <button 
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                {/* ))} */}
              </div>
            </div>
        </div>
    </>
}