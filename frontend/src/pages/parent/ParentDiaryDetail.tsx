import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import profileImg from "../../assets/parent/notice-daramgi.png";
import { getGrowthDiary } from "../../api/growthdiary";

interface DiaryEntry {
  diaryId: number;
  createDate: string;
  content: string;
  images: { imageId: number; path: string }[];
}

const ParentDiaryDetail: React.FC = () => {
  const { diaryId } = useParams<{ diaryId: string }>();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrowthDiary() {
      try {
        if (diaryId) {
          const data = await getGrowthDiary(parseInt(diaryId));
          setEntry(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch growth diary", error);
        setError("Failed to fetch growth diary");
        setLoading(false);
      }
    }

    fetchGrowthDiary();
  }, [diaryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!entry) {
    return <p>해당 성장 기록을 찾을 수 없습니다.</p>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
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
            <p className="text-lg font-medium text-[#353c4e]">
              개나리반 선생님
            </p>
          </div>

          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

            {entry.images.length > 0 && (
              <Carousel
                className="mb-8"
                showThumbs={false}
                showStatus={false}
                infiniteLoop
              >
                {entry.images.map((image) => (
                  <div key={image.imageId}>
                    <img
                      src={image.path}
                      alt={`성장 이미지 ${image.imageId}`}
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </Carousel>
            )}
            <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
              {formatDate(entry.createDate)}
            </p>
            <div className="text-[16px] text-[#212121] space-y-4 whitespace-pre-line">
              {entry.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDiaryDetail;
