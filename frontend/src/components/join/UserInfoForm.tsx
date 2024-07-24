import { ChangeEvent } from 'react';

interface UserInfoFormProps {
  formData: {
    username: string;
    password: string;
    passwordConfirm: string;
    name: string;
    email?: string;
    emailDomain?: string;
    nickname?: string;
    tel1?: string;
    tel2?: string;
    tel3?: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function UserInfoForm({ formData, handleChange }: UserInfoFormProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">
            아이디
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <span className="text-gray-500 sm:text-sm">@naver.com</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">
            비밀번호
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-900">
            비밀번호 재확인
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            이름
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900">
            본인 확인 이메일(선택)
          </label>
          <div className="mt-1 flex">
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className="block w-1/2 rounded-l-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            <select
              name="emailDomain"
              value={formData.emailDomain}
              onChange={handleChange}
              className="block w-1/2 rounded-r-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="naver.com">naver.com</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="gmail.com">gmail.com</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tel" className="block text-sm font-medium text-gray-900">
            휴대전화
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              id="tel1"
              name="tel1"
              type="tel"
              value={formData.tel1}
              onChange={handleChange}
              maxLength={3}
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            <input
              id="tel2"
              name="tel2"
              type="tel"
              value={formData.tel2}
              onChange={handleChange}
              maxLength={4}
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            <input
              id="tel3"
              name="tel3"
              type="tel"
              value={formData.tel3}
              onChange={handleChange}
              maxLength={4}
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
