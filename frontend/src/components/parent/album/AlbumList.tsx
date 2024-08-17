import { Album } from "../../../types/album";
import cryingDaramgi from "../../../assets/common/crying-daramgi.png";

interface AlbumListProps {
  albums: Album[];
  handleAlbumClick: (albumId: number) => void;
}

export default function AlbumList({ albums, handleAlbumClick }: AlbumListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4">
      {albums.length > 0 ? (
        albums.map((album) => (
          <div
            key={album.albumId}
            className="relative w-full group rounded-[10px] overflow-hidden shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleAlbumClick(album.albumId)}
            style={{
              paddingBottom: '56.25%',
            }}
          >
            <img
              src={album.images[0].path}
              alt={`${album.albumName}`}
              className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-80"
            />
            {/* 반투명 배경 박스 추가 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00000080] to-transparent opacity-90 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
            <div className="absolute bottom-0 left-0 w-full bg-[#FFF9D7CC] py-4 px-2 text-center">
              <p className="text-sm font-extrabold text-[#353c4e]">{album.albumName}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center p-4">
          <img src={cryingDaramgi} alt="Crying Daramgi" className="w-20 mt-12 mb-6 opacity-90" />
          <p className="text-center text-lg font-semibold text-[#353c4e]">
            앨범이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
