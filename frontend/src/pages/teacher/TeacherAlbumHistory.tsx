import { useEffect, useState } from "react";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { getAllClassChildAlbum } from "../../api/album";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import AlbumFolder from "../../components/teacher/album/AlbumFolder";

export default function TeacherAlbumHistory() {
    const [childrenAlbums, setChildrenAlbums] = useState([]);

    useEffect(() => {
        const teacherInfo = useTeacherInfoStore.getState().teacherInfo;
        const fetchAlbums = async () => {
            try {
                const fetchedAlbums = await getAllClassChildAlbum(teacherInfo.kindergartenClassId);
                setChildrenAlbums(fetchedAlbums);
                console.log(fetchedAlbums);
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        };

        fetchAlbums();
    }, []);

    return (
        <>
            <TeacherHeader />
            <div className="px-[150px] mt-[120px]">
                <NavigateBack backPage="사진분류" backLink='/album' />
                <Title title="사진분류내역" />
                {childrenAlbums.map((childAlbum) => {
                    // 앨범 내 전체 사진 개수 계산
                    const totalImages = childAlbum.albums.reduce((acc, album) => acc + album.images.length, 0);

                    return (
                        <div key={childAlbum.child.childId} className="flex flex-row my-10">
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
                                            <li key={album.albumId} className="mr-4 mb-4">
                                                <AlbumFolder title={album.albumName} coverImg={album.images[0].path} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
