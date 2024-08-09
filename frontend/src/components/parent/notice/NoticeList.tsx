import NoticeItem from "./NoticeItem"

export default function NoticeList({ notices, onClick }) {
  return (
    <div className="w-full space-y-6">
      {notices.length === 0 ? (
        <p className="text-center text-gray-500">알림장이 없습니다.</p>
      ) : (
        notices.map((notice) => (
          <NoticeItem key={notice.noticeBoardId} notice={notice} onClick={onClick} />
        ))
      )}
    </div>
  );
}

