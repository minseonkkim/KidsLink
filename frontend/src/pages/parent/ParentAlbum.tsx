import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonHeader from '../../components/parent/common/CommonHeader';
import InfoSection from '../../components/parent/common/InfoSection';
import SearchDateBar from '../../components/parent/common/SearchDateBar';
import daramgi from '../../assets/parent/camera-daramgi.png';


const albums = [
  {
    albumId: 1,
    albumName: '7월 27일 현장체험학습',
    albumDate: '2024-07-30 11:33:31',
    images: [
      {
        imageId: 1,
        path: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fhelpx.adobe.com%2Fcontent%2Fdam%2Fhelp%2Fen%2Fphotoshop%2Fusing%2Fquick-actions%2Fremove-background-before-qa1.png&tbnid=iaxN8zLm7TYajM&vet=12ahUKEwjInN3whdCHAxV_iK8BHYzBMzAQMygEegQIARBM..i&imgrefurl=https%3A%2F%2Fhelpx.adobe.com%2Fkr%2Fphotoshop%2Fusing%2Fquick-actions%2Fremove-background.html&docid=C6FJRaouy0cijM&w=800&h=551&q=%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwjInN3whdCHAxV_iK8BHYzBMzAQMygEegQIARBM',
      },
      {
        imageId: 2,
        path: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffh260%2Fbackground%2F20230609%2Fpngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg&tbnid=ZMjse6zkU2h2PM&vet=12ahUKEwjInN3whdCHAxV_iK8BHYzBMzAQMygLegQIARBg..i&imgrefurl=https%3A%2F%2Fkor.pngtree.com%2Ffree-backgrounds-photos%2F%25EA%25B0%2595%25EC%2595%2584%25EC%25A7%2580-%25EC%2582%25AC%25EC%25A7%2584&docid=G7Q6e_sxptR9KM&w=640&h=359&q=%EC%9D%B4%EB%AF%B8%EC%A7%80&ved=2ahUKEwjInN3whdCHAxV_iK8BHYzBMzAQMygLegQIARBg',
      },
    ],
  },
];

export default function Album() {
  const [searchDate, setSearchDate] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [scroll, setScroll] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSearchDate(selectedDate);
    if (selectedDate) {
      const filtered = albums.filter((album) =>
        album.albumDate.startsWith(selectedDate)
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

  const handleAlbumClick = (albumId: number) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-[#FFEC8A]">
      <CommonHeader title="앨범" />

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
          <SearchDateBar searchDate={searchDate} handleDateChange={handleDateChange} />
          <div
            className={`grid grid-cols-1 gap-4 ${scroll ? 'overflow-y-auto' : 'overflow-hidden'
              }`}
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
                  className="relative w-full"
                  onClick={() => handleAlbumClick(album.albumId)}
                >

                  <img
                    src={album.images[0].path} 
                    alt={`${album.albumName}`}
                    className="w-full h-[166px] object-cover rounded-tl-[20px] rounded-tr-[20px]"
                  />
                  <div className="bg-[#7c7c7c]/50 w-full h-[166px] absolute top-0 rounded-tl-[20px] rounded-tr-[20px]" />
                  <p className="absolute left-[70px] top-[39px] opacity-80 text-3xl font-bold text-left text-white">
                    +{album.images.length}
                  </p>
                  <div className="bg-white p-4 rounded-bl-[20px] rounded-br-[20px] shadow-md">
                    <p className="text-lg font-bold text-[#353c4e]">
                      {album.albumName}
                    </p>
                    <p className="text-sm font-medium text-[#757575]">
                      {new Date(album.albumDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg col-span-3">
                해당 날짜의 앨범이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
