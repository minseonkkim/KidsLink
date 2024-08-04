import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import { getKidAlbum } from '../../api/album'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function AlbumDetailCard() {
  const { albumId, imageId } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialSlide, setInitialSlide] = useState(0)
  const [sliderKey, setSliderKey] = useState(0)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const id = parseInt(albumId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid albumId')
        }
        const data = await getKidAlbum(id)
        setAlbum(data);

        // 클릭한 이미지의 인덱스를 찾기
        const initialIndex = data.images.findIndex(image => image.imageId === parseInt(imageId, 10))
        setInitialSlide(initialIndex !== -1 ? initialIndex : 0)

        // 슬라이더의 키 값을 변경하여 재렌더링을 트리거
        setSliderKey(prevKey => prevKey + 1)
      } catch (error) {
        console.error('Failed to fetch album', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [albumId, imageId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <p>Loading...</p>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <p>앨범을 불러오지 못했습니다.</p>
      </div>
    )
  }

  const settings = {
    dots: true,
    initialSlide: initialSlide, 
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  }

  return (
    <div className="flex flex-col justify-center items-center px-6">
      <h2 className="text-2xl font-bold mt-10 mb-4">{album.albumName}</h2>
      <p className="text-sm text-gray-600 mb-8">{new Date(album.albumDate).toLocaleDateString()}</p>
      <div className="w-full max-w-3xl">
        <Slider key={sliderKey} {...settings}> 
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
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
