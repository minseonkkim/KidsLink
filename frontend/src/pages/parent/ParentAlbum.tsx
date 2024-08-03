import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoSection from '../../components/parent/common/InfoSection';
import SearchTitleBar from '../../components/parent/common/SearchTitleBar';
import daramgi from '../../assets/parent/camera-daramgi.png';
import { getKidAllAlbums } from '../../api/album';
import { useParentInfoStore } from '../../stores/useParentInfoStore';

export default function Album() {
  const [searchTitle, setSearchTitle] = useState('');
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [scroll, setScroll] = useState(false);
  const divRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const childId = useParentInfoStore.getState().parentInfo.child.childId;
    const fetchData = async () => {
      try {
        const data = await getKidAllAlbums(childId);
        setAlbums(data);
        setFilteredAlbums(data);
      } catch (error) {
        console.error('Failed to fetch albums', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTitle(query);
    if (query) {
      const filtered = albums.filter((album) =>
        album.albumName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(albums);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const topPosition = divRef.current.getBoundingClientRect().top;
        if (topPosition <= 200) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <div className="w-full flex flex-col items-center mt-16 flex-grow">
        <InfoSection
          main1="아이의 추억"
          main2="을"
          description2="차곡차곡 담았어요!"
          imageSrc={daramgi}
          altText="다람쥐"
        />

        <div
          ref={divRef}
          className="w-full bg-white rounded-tl-[20px] rounded-tr-[20px] px-12 shadow-top flex-grow overflow-hidden animate-slideUp"
          style={{ marginTop: '-40px' }}
        >
          <SearchTitleBar searchTitle={searchTitle} handleSearch={handleSearch} />
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'}`}
            style={{
              maxHeight: scroll ? 'calc(100vh - 200px)' : 'auto',
              paddingBottom: '100px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <div
                  key={album.albumId}
                  className="relative w-full group shadow-lg rounded-[20px] overflow-hidden transition-transform duration-200 ease-in-out transform hover:scale-105"
                  onClick={() => handleAlbumClick(album.albumId)}
                  style={{
                    paddingBottom: '100%', // Square aspect ratio
                  }}
                >
                  <img
                    src={album.images[0].path}
                    alt={`${album.albumName}`}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-90"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-[#FFF9D7] bg-opacity-80 p-2 text-center">
                    <p className="text-md font-bold text-[#353c4e]">
                      {album.albumName}
                    </p>
                    <p className="text-xs font-medium text-[#757575]">
                      {new Date(album.albumDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg col-span-4">
                해당 제목의 앨범이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
