import { useNavigate } from 'react-router-dom'

export default function AlbumContent({ images, albumId }) {
  const navigate = useNavigate()

  const handleImageClick = (imageId) => {
    navigate(`/album/${albumId}/image/${imageId}`)
  }

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      {images.map((image) => (
        <div
          key={image.imageId}
          className="relative group bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => handleImageClick(image.imageId)}
          style={{
            height: '0',
            paddingBottom: '100%',
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
  )
}
