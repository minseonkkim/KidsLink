import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getKidAlbum } from '../../api/album'
import AlbumContent from '../../components/parent/album/AlbumContent'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AlbumDetail() {
  const { albumId } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const id = parseInt(albumId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid albumId')
        }
        const data = await getKidAlbum(id)
        setAlbum(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch album', error)
        setLoading(false)
      }
    }
    fetchAlbum()
  }, [albumId])

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <p>앨범을 불러오지 못했습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-6">
      <div className="mt-16 relative w-full bg-[#fff9d7] rounded-[20px] px-6 py-8 shadow-lg border-2 border-[#ffec8a]">
        {/* 테이프 효과 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-300 z-10"></div>

        <p className="text-[20px] font-bold text-[#212121] mb-8 text-center">
          {album.albumName}
        </p>
        {/* <p className="text-[14px] font-light text-[#353c4e] mb-6 text-center">
          {formatDate(album.albumDate)}
        </p> */}
        <AlbumContent images={album.images} albumId={albumId} />
      </div>
    </div>
  )
}
