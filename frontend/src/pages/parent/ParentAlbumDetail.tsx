import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKidAlbum } from '../../api/album';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("albumId: ", albumId);
    const fetchAlbum = async () => {
      try {
        const id = parseInt(albumId, 10); // albumId를 정수로 변환
        if (isNaN(id)) {
          throw new Error('Invalid albumId');
        }
        const data = await getKidAlbum(id);
        setAlbum(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch album', error);
        setError('Failed to fetch album');
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
        <p>{error}</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
        <p>앨범을 불러오지 못했습니다.</p>
      </div>
    );
  }

  const handleImageClick = (imageId) => {
    navigate(`/album/${albumId}/image/${imageId}`);
  };

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
        <div className="relative w-full mt-16 mb-12">

          <div className="relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a] bg-notebook-pattern">
            {/* 테이프 효과 */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

            <p className="text-[20px] font-bold text-[#212121] mb-2 text-center">
              {album.albumName}
            </p>
            <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
              {formatDate(album.albumDate)}
            </p>
            <div className="w-full grid grid-cols-3 gap-2">
              {album.images.map((image) => (
                <div
                  key={image.imageId}
                  className="relative group bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => handleImageClick(image.imageId)}
                  style={{
                    height: '0',
                    paddingBottom: '100%', // 정사각형 비율
                  }}
                >
                  <img
                    src={image.path}
                    alt={`앨범 이미지 ${image.imageId}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
