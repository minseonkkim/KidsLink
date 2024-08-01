// 프로필 이미지 업로드

import { ChangeEvent, useEffect, useState } from "react"
import { CiCamera } from "react-icons/ci"

interface ProfileImageUploadProps {
  profile: File | undefined
  setProfile: (file: File) => void
}

export default function ProfileImageUpload({ profile, setProfile }: ProfileImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      const newImage = URL.createObjectURL(profile)
      setImagePreview(newImage)
    }
  }, [profile])

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newImage = URL.createObjectURL(file)
      setImagePreview(newImage)
      setProfile(file)
    }
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-400">
        프로필 이미지
      </label>
      <div className="flex flex-col items-center mt-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="profileImage"
          onChange={handleImageUpload}
          autoComplete="photo"
        />
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-400 rounded-full overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <CiCamera className="text-3xl" />
                <span className="text-sm">이미지 업로드</span>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  )
}
