import React from 'react';

interface GrowthDiaryItemProps {
    date: string;
    imgPaths: string[];
}

export default function GrowthDiaryItem({ date, imgPaths }:GrowthDiaryItemProps){
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

    return (
        <div style={outerContainerStyle}>
            {imgPaths.length > 0 && <div style={backgroundImageWrapperStyle} />}
            <p style={{ position: 'relative', zIndex: 10, fontWeight: 'bold', fontSize: '18px' }}>{date}</p>
        </div>
    );
};
