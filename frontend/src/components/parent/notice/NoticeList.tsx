import NoticeItem from "./NoticeItem"
import cryingDaramgi from "../../../assets/common/crying-daramgi.png"

export default function NoticeList({ notices, onClick }) {
  return (
    <div className="w-full space-y-6">
      {notices.length === 0 ? (
          <div className="col-span-4 flex flex-col items-center justify-center">
            <img src={cryingDaramgi} alt="Crying Daramgi" className="w-16 mt-12 mb-4" />
            <p className="text-center text-gray-500">
              알림장이 없습니다.
            </p>
          </div>
      ) : (
        notices.map((notice) => (
          <NoticeItem key={notice.noticeBoardId} notice={notice} onClick={onClick} />
        ))
      )}
    </div>
  );
}

