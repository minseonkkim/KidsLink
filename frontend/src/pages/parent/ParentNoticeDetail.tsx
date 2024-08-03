import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profileImg from "../../assets/parent/notice-daramgi.png";
import { getNoticeDetail } from "../../api/notice";

interface NoticeDetail {
  noticeBoardId: number;
  teacherName: string;
  title: string;
  content: string;
  noticeBoardDate: string;
}

export default function ParentNoticeDetail() {
  const { noticeId } = useParams<{ noticeId: string }>();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        if (noticeId) {
          const detail = await getNoticeDetail(Number(noticeId));
          setNotice(detail);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch notice detail:", error);
        setError("Failed to fetch notice detail");
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [noticeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!notice) {
    return <p>해당 알림장을 찾을 수 없습니다.</p>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
      <div className="flex flex-1 flex-col my-16 items-center px-6">
        <div className="relative w-full mt-4 mb-12">
          <div className="flex items-center my-6">
            <div className="w-[40px] h-[40px] mr-2">
              <img
                src={profileImg}
                className="w-full h-full object-cover rounded-full"
                alt="프로필 이미지"
              />
            </div>
            <p className="text-[16px] font-medium text-[#353c4e]">
              {notice.teacherName}
            </p>
          </div>

          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

            <p className="text-[20px] font-bold text-[#212121] mb-2 text-center">
              {notice.title}
            </p>
            <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
              {formatDate(notice.noticeBoardDate)}
            </p>
            <div className="text-[16px] text-[#212121] space-y-4 whitespace-pre-line">
              {notice.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
