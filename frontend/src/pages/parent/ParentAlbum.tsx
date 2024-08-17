import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoSection from "../../components/parent/common/InfoSection";
import SearchTitleBar from "../../components/parent/common/SearchTitleBar";
import AlbumList from "../../components/parent/album/AlbumList";
import daramgi from "../../assets/parent/camera-daramgi.png";
import { getKidAllAlbums } from "../../api/album";
import { useParentInfoStore } from "../../stores/useParentInfoStore";
import { getParentInfo } from "../../api/info";

export default function Album() {
  const [searchTitle, setSearchTitle] = useState("");
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const navigate = useNavigate();

  const parentInfo = useParentInfoStore((state) => state.parentInfo);
  const setParentInfo = useParentInfoStore((state) => state.setParentInfo);
  const childId = parentInfo?.child.childId;

  useEffect(() => {
    async function fetchParentInfoAndAlbums() {
      try {
        let currentChildId = childId;
        if (!currentChildId) {
          const fetchedParentInfo = await getParentInfo();
          setParentInfo(fetchedParentInfo);
          currentChildId = fetchedParentInfo.child.childId;
        }

        if (currentChildId) {
          const albums = await getKidAllAlbums(currentChildId);
          setAlbums(albums);
          setFilteredAlbums(albums);
        }
      } catch (error) {
        console.error("Failed to fetch albums", error);
      }
    }
    fetchParentInfoAndAlbums();
  }, [childId, setParentInfo]);

  const handleSearch = (e) => {
    const title = e.target.value;
    setSearchTitle(title);
    if (title) {
      const filtered = albums.filter((album) =>
        album.albumName.toLowerCase().includes(title.toLowerCase())
      );
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(albums);
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFEC8A]">
      <InfoSection
        main1="아이의 추억"
        main2="을"
        description2="차곡차곡 담았어요!"
        imageSrc={daramgi}
        altText="다람쥐"
      />

      <div className="flex flex-col flex-grow overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white shadow-top px-12 py-4 animate-slideUp -mt-10">
        <SearchTitleBar searchTitle={searchTitle} onSearch={handleSearch} />
        <div className="flex-grow overflow-y-auto space-y-6 pb-6">
          <AlbumList
            albums={filteredAlbums}
            handleAlbumClick={handleAlbumClick}
          />
        </div>
      </div>
    </div>
  );
}
