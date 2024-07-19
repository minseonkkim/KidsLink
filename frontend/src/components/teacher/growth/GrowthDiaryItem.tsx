import React from 'react';
import useModal from '../../../hooks/teacher/useModal';

interface GrowthDiaryItemProps {
    date: string;
    imgPaths: string[];
}

export default function GrowthDiaryItem({ date, imgPaths }:GrowthDiaryItemProps){
    const { openModal, Modal } = useModal();
    
    const backgroundImageWrapperStyle: React.CSSProperties = {
        backgroundImage: imgPaths.length > 0 ? `url(${imgPaths[0]})` : 'none',
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
        backgroundColor: imgPaths.length === 0 ? '#D5E4B4' : 'transparent',
    };

    const openReadModal = () => {
        openModal(
            <div className="w-[500px] h-[400px]">
                <div className="block mr-3 mb-4 font-bold whitespace-nowrap text-[18px]">2024.07.11</div>
                <div className="cursor-pointer mb-4 bg-[#f4f4f4] w-[100px] h-[100px] rounded-[10px] flex items-center justify-center border-[1px]">
             
                </div>
                <div className="">
                오늘 민선이는 블록 놀이 시간에 정말 멋진 성을 만들었어요. 친구들과 함께 협력하여 각자의 역할을 맡아 성을 쌓아 올렸고, 중간중간 의견 충돌이 있었지만 잘 해결하는 모습을 보였어요. 민선이가 성의 입구 부분을 맡아서 더욱 견고하게 만들었답니다. 민선이의 창의력과 협동심이 돋보였던 하루였어요.
                </div>
            </div>
        )
    }

    return (
        <>
            <div onClick={openReadModal} style={outerContainerStyle}>
                {imgPaths.length > 0 && <div style={backgroundImageWrapperStyle} />}
                <p style={{ position: 'relative', zIndex: 10, fontWeight: 'bold', fontSize: '18px' }}>{date}</p>
            </div>
            <Modal/>
        </>
    );
};
