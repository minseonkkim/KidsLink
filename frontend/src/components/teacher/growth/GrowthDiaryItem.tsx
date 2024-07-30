import React from 'react';
import useModal from '../../../hooks/teacher/useModal';

interface GrowthDiaryItemProps {
    diaryId: number;
    createDate: string;
    content: string;
    images: string[];
    onClick: () => void;
}

export default function GrowthDiaryItem({ createDate, content, images }:GrowthDiaryItemProps){
    const { openModal, Modal } = useModal();
    
    const backgroundImageWrapperStyle: React.CSSProperties = {
        backgroundImage: images.length > 0 ? `url(${images[0]})` : 'none',
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
            <div className="w-[500px] h-[400px]">
                <div className="block mr-3 mb-4 font-bold whitespace-nowrap text-[18px]">{createDate}</div>
                {images.length > 0 && <div className="w-full h-[120px] ml-2 flex flex-row overflow-x-auto whitespace-nowrap custom-x-scrollbar">
                    {
                        images.map((image, index) => (
                            <div key={index} className="w-[100px] h-[100px] relative mr-2 flex-shrink-0">
                            <img
                            src={image}
                            alt={`photo ${index}`}
                            className="object-cover w-[100px] h-[100px] rounded-[10px] border-[1px]"
                            />
                        </div>
                        ))
                    }
                </div>}
                <div className="">
                    {content}
                </div>
            </div>
        )
    }

    return (
        <>
            <div onClick={openReadModal} style={outerContainerStyle}>
                {images.length > 0 && <div style={backgroundImageWrapperStyle} />}
                <p style={{ position: 'relative', zIndex: 10, fontWeight: 'bold', fontSize: '18px' }}>{createDate}</p>
            </div>
            <Modal/>
        </>
    );
};
