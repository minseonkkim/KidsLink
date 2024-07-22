import { ChangeEvent, useState } from 'react'
import parentApi from '../../api/join/ParentApi'
import { CiCamera } from 'react-icons/ci'
import UserInfoForm from './UserInfoForm'

interface Child {
  name: string;
  kindergartenClassName: string;
  kindergartenName: string;
  gender: string;
  birth: string;
}

interface ParentData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  tel: string;
  child: Child;
}

export default function ParentForm() {
  const [formData, setFormData] = useState<ParentData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    tel: "",
    child: {
      name: "",
      kindergartenClassName: "",
      kindergartenName: "",
      gender: "",
      birth: "",
    }
  })

  const [image, setImage] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name in formData.child) {
      setFormData({
        ...formData,
        child: { ...formData.child, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value })
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImage(newImage)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await parentApi.register(formData)
      console.log('Parent registration successful', response)
    } catch (error) {
      console.error('Error during parent registration', error)
    }
  }

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
            <h1 className="mt-5 text-base font-semibold leading-7 text-gray-900">자녀 등록하기</h1>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="childName" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 이름
                </label>
                <div className="mt-2">
                  <input
                    id="childName"
                    name="name"
                    type="text"
                    value={formData.child.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 성별
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.child.gender}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>성별을 선택해주세요</option>
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="birth" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 생일
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="birth"
                    name="birth"
                    value={formData.child.birth}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="kindergartenName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 선택
                </label>
                <div className="mt-2">
                  <select
                    id="kindergartenName"
                    name="kindergartenName"
                    value={formData.child.kindergartenName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>유치원을 선택해주세요</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="kindergartenClassName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 반 이름
                </label>
                <div className="mt-2">
                  <input
                    id="kindergartenClassName"
                    name="kindergartenClassName"
                    type="text"
                    value={formData.child.kindergartenClassName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                  />
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
  )
}