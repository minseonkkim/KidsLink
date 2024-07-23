import { ChangeEvent, useState, useEffect, FormEvent } from 'react'
import { parentSignup } from '../../api/Member'
import { CiCamera } from 'react-icons/ci'
import UserInfoForm from './UserInfoForm'

interface Child {
  name?: string;
  kindergartenClassName?: string;
  kindergartenName?: string;
  gender?: string;
  birth?: string;
}

interface ParentData {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
  email?: string;
  profile?: File;
  nickname?: string;
  tel?: string;
  child?: Child;
}

const kindergartens = [
  { name: "햇살 유치원", classes: ["햇살반", "별빛반", "꿈나무반"] },
  { name: "별빛 유치원", classes: ["햇살반", "별빛반", "꿈나무반"] },
  { name: "꿈나무 유치원", classes: ["햇살반", "별빛반", "꿈나무반"] },
]


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
    },
    profile: undefined
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classOptions, setClassOptions] = useState<string[]>([])

  useEffect(() => {
    const selectedKindergarten = kindergartens.find(kg => kg.name === formData.child?.kindergartenName)
    if (selectedKindergarten) {
      setClassOptions(selectedKindergarten.classes)
    } else {
      setClassOptions([])
    }
  }, [formData.child?.kindergartenName])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('child.')) {
      const childName = name.split('.')[1]
      setFormData({
        ...formData,
        child: { ...formData.child, [childName]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newImage = URL.createObjectURL(file)
      setImagePreview(newImage);
      setFormData({ ...formData, profile: file })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await parentSignup(formData)
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
              className="flex flex-col items-center justify-center bg-[#F4F4F4] border-[#363636] border-[1px] w-[200px] h-[200px] rounded-full p-6 cursor-pointer"
              style={{
                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!imagePreview && (
                <>
                  <CiCamera className="text-[70px] mb-5" />
                  <span className="text-[20px] font-bold">프로필 등록</span>
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
                <label htmlFor="child.name" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 이름
                </label>
                <div className="mt-2">
                  <input
                    id="child.name"
                    name="child.name"
                    type="text"
                    value={formData.child?.name || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="child.gender" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 성별
                </label>
                <div className="mt-2">
                  <select
                    id="child.gender"
                    name="child.gender"
                    value={formData.child?.gender || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>성별을 선택해주세요</option>
                    <option value="M">남자</option>
                    <option value="F">여자</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="child.birth" className="block text-sm font-medium leading-6 text-gray-900">
                  자녀 생일
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="child.birth"
                    name="child.birth"
                    value={formData.child?.birth || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="child.kindergartenName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 선택
                </label>
                <div className="mt-2">
                  <select
                    id="child.kindergartenName"
                    name="child.kindergartenName"
                    value={formData.child?.kindergartenName || ""}
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
                <label htmlFor="child.kindergartenClassName" className="block text-sm font-medium leading-6 text-gray-900">
                  유치원 반 이름
                </label>
                <div className="mt-2">
                  <select
                    id="child.kindergartenClassName"
                    name="child.kindergartenClassName"
                    value={formData.child?.kindergartenClassName || ""}
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
  )
}
