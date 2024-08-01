import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { useState, ChangeEvent } from "react";
import { FiUpload } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createClassifyImages } from "../../api/album";

export default function TeacherAlbum() {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleDeleteImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleClassify = async () => {
    await createClassifyImages(images);
  }

  return (
    <>
      <TeacherHeader/>
      <div className="px-[150px] mt-[120px]">
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="사진분류"/>
        <div className={`h-[470px] flex flex-row items-center ${images.length === 0 ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex flex-col items-center ${images.length === 0 ? 'mx-auto' : ''}`}>
            <label className="flex flex-col items-center justify-center bg-[#FFF9D7] border-[#FFE96F] border-[2px] w-[300px] h-[300px] rounded-[360px] p-6 cursor-pointer">
              <FiUpload className="text-[70px] mb-5"/>
              <span className="text-[20px] font-bold">사진업로드</span>
              <input type="file" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {images.length > 0 && (
            <div className="flex flex-col justify-center items-center mt-8">
              <div className="grid grid-cols-5 gap-4 overflow-y-auto h-[442px] border-[#B2D170] border-[1px] mt-10 rounded-[10px] content-start p-3">
                {images.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img src={image} alt={`upload-${index}`} className="object-cover w-full h-full rounded-md" />
                    <button 
                      onClick={() => handleDeleteImage(index)} 
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleClassify} className="mt-5 font-bold py-2 px-4 bg-gradient-to-br from-[#FFF3B1] to-[#D5E4B4] rounded-[10px] w-[240px] h-[45px]">
                아이별로 분류하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
