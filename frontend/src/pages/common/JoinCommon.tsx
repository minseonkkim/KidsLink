import { ChangeEvent, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";

interface CommonContentProps {
    role: string;
}

export default function CommonContent({role}: CommonContentProps) {
    const [image, setImage] = useState<string | null>(null);
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newImage = URL.createObjectURL(file);
            setImage(newImage);
        }
    };

    return (
        <div>
            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <h2 className="text-base font-semibold leading-7 text-gray-900 mt-14">프로필 사진</h2>
                            <div className="col-span-full">
                                <label
                                    className="flex flex-col items-center justify-center bg-[#FFF9D7] border-[#FFE96F] border-[1px] w-[200px] h-[200px] rounded-[360px] p-6 cursor-pointer"
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

                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-10">
                        <h1>{role} 정보</h1>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    이름
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            <div className="sm:col-span-3">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                    아이디
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="username"
                                        autoComplete="username"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    비밀번호
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-gray-900">
                                    비밀번호 확인
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password-confirm"
                                        name="password-confirm"
                                        type="password-confirm"
                                        autoComplete="password-confirm"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    이메일 주소
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="kindergarten" className="block text-sm font-medium leading-6 text-gray-900">
                                    유치원 선택
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="kindergarten"
                                        name="kindergarten"
                                        autoComplete="kindergarten-name"
                                        defaultValue="유치원을 선택해주세요"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option disabled>유치원을 선택해주세요</option>
                                        <option>Canada</option>
                                        <option>Mexico</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                                    핸드폰 번호
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone-number"
                                        name="phone-number"
                                        type="text"
                                        autoComplete="phone-number"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        {role === '학부모' && (
                            <div className="border-b border-gray-900/10 pb-5">
                                <h1 className="mt-5 text-base font-semibold leading-7 text-gray-900">자녀 등록하기</h1>
                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="child-name" className="block text-sm font-medium leading-6 text-gray-900">
                                            자녀 이름
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="child-name"
                                                name="child-name"
                                                type="text"
                                                autoComplete="child-name"
                                                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="child-gender" className="block text-sm font-medium leading-6 text-gray-900">
                                            자녀 성별
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="child-gender"
                                                name="child-gender"
                                                autoComplete="child-gender"
                                                defaultValue="성별을 선택해주세요"
                                                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option disabled>성별을 선택해주세요</option>
                                                <option>남자</option>
                                                <option>여자</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="child-birthday" className="block text-sm font-medium leading-6 text-gray-900">자녀 생일</label>
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                id="child-birthday"
                                                name="child-birthday"
                                                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#B2D170] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </form>
        </div>

    );
};