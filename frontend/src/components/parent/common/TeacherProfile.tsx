export default function TeacherProfile({ profileImg, teacherName }) {
  return (
    <div className="flex items-center mt-8">
      <div className="w-[30px] h-[30px] mr-1">
        <img
          src={profileImg}
          className="w-full h-full object-cover rounded-full"
          alt="프로필 이미지"
        />
      </div>
      <p className="text-[16px] font-medium text-[#353c4e]">
        {teacherName} 선생님
      </p>
    </div>
  )
}


