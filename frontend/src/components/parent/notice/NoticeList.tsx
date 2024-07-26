import NoticeItem from './NoticeItem';

interface NoticeListProps {
  notices: {
    noticeBoardId: number;
    noticeBoardDate: string; // date를 createDate로 변경
    title: string;
  }[];
  handleNoticeClick: (id: number) => void;
  scroll: boolean;
}

export default function NoticeList({ notices, handleNoticeClick, scroll }: NoticeListProps) {
  return (
    <div className={`space-y-6 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto', paddingBottom: '100px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {notices.map(notice => (
        <NoticeItem key={notice.noticeBoardId} notice={notice} handleClick={handleNoticeClick} />
      ))}
    </div>
  );
}
