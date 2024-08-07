import React from 'react';
import useModal from '../../../hooks/teacher/useModal';

interface GrowthDiaryItemProps {
    diaryId: number;
    createDate: string;
    content: string;
    thumbnail: string;
    images: { imageId: number, path: string }[];
    onClick: () => void;
}

const GrowthDiaryModalContent = ({ createDate, content, images }: GrowthDiaryItemProps) => (
    <div className="w-[500px] h-[400px] p-4">
        <div className="block mb-4 font-bold text-[18px]">{createDate}</div>
        {images.length > 0 && (
            <div className="flex flex-row overflow-x-auto">
                {images.map((image, index) => (
                    <div key={index} className="w-[100px] h-[100px] relative mr-2 flex-shrink-0">
                        <img
                            src={image.path}
                            alt={`photo ${index}`}
                            className="object-cover w-full h-full rounded-[10px] border-[1px]"
                        />
                    </div>
                ))}
            </div>
        )}
        <div className="mt-4">{content}</div>
    </div>
);

export default function GrowthDiaryItem({ diaryId, createDate, content, thumbnail, images, onClick }: GrowthDiaryItemProps) {
    const { openModal, Modal } = useModal();
    
    const backgroundImageWrapperStyle: React.CSSProperties = {
        backgroundImage: images.length > 0 ? `url(${thumbnail})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    };

    const outerContainerStyle: React.CSSProperties = {
        position: 'relative',
        borderRadius: '10px',
        width: '135px',
        height: '135px',
        margin: '17px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: images.length === 0 ? '#D5E4B4' : 'transparent',
    };

    const openReadModal = () => {
        openModal(
            <GrowthDiaryModalContent
                diaryId={diaryId}
                createDate={createDate}
                content={content}
                thumbnail={thumbnail}
                images={images}
                onClick={onClick}
            />
        );
    };

    return (
        <>
            <div onClick={openReadModal} style={outerContainerStyle}>
                {thumbnail && <div style={backgroundImageWrapperStyle} />}
                <p style={{ position: 'relative', zIndex: 10, fontWeight: 'bold', fontSize: '18px'}}>{createDate}</p>
            </div>
            <Modal/>
        </>
    );
};
