import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { getKidAlbum } from '../../api/album';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiDownload } from 'react-icons/fi';  // react-icons 라이브러리에서 다운로드 아이콘 가져오기
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const id = parseInt(albumId, 10);
        if (isNaN(id)) {
          throw new Error('Invalid albumId');
        }
        const data = await getKidAlbum(id);
        setAlbum(data);
      } catch (error) {
        console.error('Failed to fetch album', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <p>앨범을 불러오지 못했습니다.</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const downloadImage = (url: string, filename: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="flex flex-col justify-center items-center px-6">
      <h2 className="text-2xl font-bold mt-10 mb-4">{album.albumName}</h2>
      <p className="text-sm text-gray-600 mb-8">{new Date(album.albumDate).toLocaleDateString()}</p>
      <div className="w-full max-w-3xl">
        <Slider {...settings}>
          {album.images.map((image) => (
            <div
              key={image.imageId}
              className="relative w-full group bg-white shadow-lg rounded-[20px]"
            >
              <img
                src={image.path}
                alt={`앨범 이미지 ${image.imageId}`}
                className="w-full h-[500px] object-cover rounded-[20px]"
              />
              <button
                onClick={() => downloadImage(image.path, `image-${image.imageId}.jpg`)}
                className="absolute bottom-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg"
              >
                <FiDownload size={24} /> {/* 다운로드 아이콘 */}
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
