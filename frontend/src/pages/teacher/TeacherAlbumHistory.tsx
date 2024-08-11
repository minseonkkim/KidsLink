import { useEffect, useState } from "react";
import Title from "../../components/teacher/common/Title";
import { getAllClassChildAlbum } from "../../api/album";
import { getTeacherInfo } from "../../api/Info"; 
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import AlbumFolder from "../../components/teacher/album/AlbumFolder";
import useModal from "../../hooks/teacher/useModal";
import TeacherLayout from "../../layouts/TeacherLayout";
import daramgi from "../../assets/teacher/camera-daramgi.png";

export default function TeacherAlbumHistory() {
    const [childrenAlbums, setChildrenAlbums] = useState([]);
    const { openModal, Modal } = useModal();
    const teacherInfo = useTeacherInfoStore(state => state.teacherInfo);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbums = async (classId) => {
            try {
                const fetchedAlbums = await getAllClassChildAlbum(classId);
                setChildrenAlbums(fetchedAlbums);
                console.log(fetchedAlbums);
            } catch (error) {
                console.error('Error fetching albums:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!teacherInfo) {
            getTeacherInfo()
                .then((data) => {
                    useTeacherInfoStore.setState({ teacherInfo: data });
                    fetchAlbums(data.kindergartenClassId);
                })
                .catch((error) => {
                    console.error("Failed to fetch teacher info:", error);
                    setLoading(false); // 에러 발생 시 로딩을 멈춤
                });
        } else {
            fetchAlbums(teacherInfo.kindergartenClassId);
        }
    }, [teacherInfo]);

    const handleAlbumClick = (images) => {
        openModal(
            <div className="grid grid-cols-3 gap-4 h-[500px] overflow-y-auto custom-scrollbar">
                {images.map((image) => (
                    <img
                        key={image.imageId}
                        src={image.path}
                        alt={`Album image ${image.imageId}`}
                        className="w-full h-auto rounded-md"
                    />
                ))}
            </div>
        );
    };

    const tabs = [
        { label: "사진분류", link: "/album" },
        { label: "전송내역", link: "/album/history" },
    ];

    return (
        <TeacherLayout
            activeMenu="album"
            setActiveMenu={() => {}}
            titleComponent={<Title title="사진전송내역" tabs={tabs} />}
            imageSrc={daramgi} 
        >
            <div className="w-full my-10 mb-32 px-[150px]">
                {loading ? (
                    <p>로딩 중...</p>
                ) : (
                    childrenAlbums.length > 0 ? (
                        childrenAlbums.map((childAlbum) => {
                            const totalImages = childAlbum.albums.reduce((acc, album) => acc + album.images.length, 0);

                            return (
                                <div key={childAlbum.child.childId} className="flex flex-col lg:flex-row my-10">
                                    <span className='bg-[#8CAD1E] text-[#fff] cursor-pointer flex items-center justify-center rounded-[30px] w-[95px] h-[45px] font-bold mx-3 my-2 text-[17px]'>
                                        {childAlbum.child.name}
                                    </span>
                                    <div className='border-[#8CAD1E] p-5 mb-2 w-full overflow-y-auto rounded-[10px] border-[1px]'>
                                        <div className="text-right text-[16px] text-gray-700">
                                            전체 사진 개수: {totalImages}장
                                        </div>
                                        {childAlbum.albums.length > 0 ? (
                                            <ul className="flex flex-row flex-wrap">
                                                {childAlbum.albums.map((album) => (
                                                    <li
                                                        key={album.albumId}
                                                        className="mr-4 mb-4"
                                                        onClick={() => handleAlbumClick(album.images)} // 클릭 시 모달 열기
                                                    >
                                                        <AlbumFolder
                                                            title={album.albumName}
                                                            coverImg={album.images[0]?.path}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>앨범이 없습니다.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>앨범이 없습니다.</p>
                    )
                )}
            </div>
            <Modal />
        </TeacherLayout>
    );
}
