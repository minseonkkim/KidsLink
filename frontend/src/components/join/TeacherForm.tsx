import { ChangeEvent, useState, useEffect } from 'react';
import { teacherSignup } from '../../api/Member'
import { CiCamera } from 'react-icons/ci';
import UserInfoForm from './UserInfoForm';

interface TeacherData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  tel: string;
  kindergartenName: string;
  kindergartenClassName: string;
}

const kindergartens = [
  { name: "사랑 유치원", classes: ["사랑반", "기쁨반"] },
  { name: "희망 유치원", classes: ["꿈나무반", "햇살반"] },
  { name: "기쁨 유치원", classes: ["별빛반", "달빛반"] }
];

export default function TeacherForm() {
  const [formData, setFormData] = useState<TeacherData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    tel: "",
    kindergartenName: "",
    kindergartenClassName: "",
  });

  const [image, setImage] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<string[]>([]);

  useEffect(() => {
    const selectedKindergarten = kindergartens.find(kg => kg.name === formData.kindergartenName);
    if (selectedKindergarten) {
      setClassOptions(selectedKindergarten.classes);
    } else {
      setClassOptions([]);
    }
  }, [formData.kindergartenName]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImage(newImage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await teacherSignup(formData);
      console.log('Teacher registration successful', response);
    } catch (error) {
      console.error('Error during teacher registration', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="mt-10 flex justify-center">
            <label
              className="flex flex-col items-center justify-center bg-[#FFF9D7] border-[#FFE96F] border-[1px] w-[200px] h-[200px] rounded-full p-6 cursor-pointer"
              style={{
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!image && (
                <>
                  <CiCamera className="text-[70px] mb-5" />
                  <span className="text-[20px] font-bold">사진 등록</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <UserInfoForm formData={formData} handleChange={handleChange} />

          <div className="border-t border-gray-900/10 pb-5">
            <h1 className="mt-5 text-base font-semibold leading-7 text-gray-900">유치원 정보</h1>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="kindergartenName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 선택
                </label>
                <div className="mt-2">
                  <select
                    id="kindergartenName"
                    name="kindergartenName"
                    value={formData.kindergartenName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>유치원을 선택해주세요</option>
                    {kindergartens.map(kg => (
                      <option key={kg.name} value={kg.name}>{kg.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="kindergartenClassName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 반 이름
                </label>
                <div className="mt-2">
                  <select
                    id="kindergartenClassName"
                    name="kindergartenClassName"
                    value={formData.kindergartenClassName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>반 이름을 선택해주세요</option>
                    {classOptions.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-10">
          <button type="submit" className="bg-[#B2D170] text-white py-2 px-4 rounded">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
