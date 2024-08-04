import NoticeItem from "./NoticeItem"

export default function NoticeList({ notices, onClick }) {
  return (
    <div className="w-full space-y-6">
      {notices.map((notice) => (
        <NoticeItem key={notice.noticeBoardId} notice={notice} onClick={onClick} />
      ))}
    </div>
  )
}

