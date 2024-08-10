import { Album } from "../../../api/album"
import daramgi from '../../../assets/parent/crying-daramgi.png'

interface AlbumListProps {
  albums: Album[];
  handleAlbumClick: (albumId: number) => void;
}

export default function AlbumList({ albums, handleAlbumClick }: AlbumListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto">
      {albums.length > 0 ? (
        albums.map((album) => (
          <div
            key={album.albumId}
            className="relative w-full group rounded-[20px] overflow-hidden transition-transform duration-200 ease-in-out transform hover:scale-105"
            onClick={() => handleAlbumClick(album.albumId)}
            style={{
              paddingBottom: '100%', 
            }}
          >
            <img
              src={album.images[0].path}
              alt={`${album.albumName}`}
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-90"
            />
            <div className="absolute bottom-0 left-0 w-full bg-[#FFF9D7] p-2 text-center">
              <p className="text-md font-bold text-[#353c4e]">{album.albumName}</p>
              <p className="text-xs font-medium text-[#757575]">
                {new Date(album.albumDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-4 flex flex-col items-center justify-center">
          <img src={daramgi} alt="Crying Daramgi" className="w-20 mt-12 mb-4" />
          <p className="text-center text-gray-500">
            앨범이 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
