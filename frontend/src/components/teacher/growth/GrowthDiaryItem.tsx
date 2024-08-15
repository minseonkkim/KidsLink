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
    <div className="w-[327px] lg:w-[500px] h-[400px] p-4">
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
            <div
                onClick={openReadModal}
                className={`relative cursor-pointer rounded-[10px] w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] lg:m-[17px] m-[14px] flex items-center justify-center overflow-hidden ${
                    images.length === 0 ? 'bg-[#D5E4B4]' : 'bg-transparent'
                }`}
            >
                {thumbnail && (
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-40"
                        style={{ backgroundImage: `url(${thumbnail})` }}
                    />
                )}
                <p className="relative z-10 font-bold lg:text-[18px] text-[15px]">{createDate}</p>
            </div>
            <Modal />
        </>
    );
}
