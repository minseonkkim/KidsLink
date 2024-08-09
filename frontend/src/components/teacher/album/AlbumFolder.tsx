interface AlbumFolderProps{
    title: string;
    coverImg?: string;
}

export default function AlbumFolder({title, coverImg}: AlbumFolderProps) {
    return (
        <div className="relative w-40 h-32 mx-[11px] my-5 cursor-pointer">
            {/* 폴더의 탭 부분 */}
            <div className="absolute top-0 left-0 w-[70px] h-6 bg-[#D0E3A7] rounded-t-md"></div>
            
            {/* 폴더의 본체 부분 */}
            <div className="absolute top-4 left-0 w-full h-28 bg-[#D5E4B4] rounded-md"></div>
            
            {/* 폴더의 안쪽 음영 부분 */}
            <div className="text-[17px] absolute top-4 left-0 w-full h-24 bg-[#FFF9D7] rounded-md flex items-center justify-center font-bold p-8"
            style={{
                backgroundImage: `url(${coverImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // 투명도 30%를 적용하기 위해 배경에 반투명 흰색을 추가
                backgroundBlendMode: 'overlay' // 이미지와 배경색을 오버레이하여 투명도 효과를 적용
            }}>{title}</div>
        </div>
    );
}
