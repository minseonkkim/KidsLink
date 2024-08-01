// 이 페이지는 나중에 시간나면 완성하기

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { getKidAlbum } from '../../api/album';
import { FiDownload } from 'react-icons/fi'; // 아이콘 라이브러리 추가

export default function ParentAlbumDecorate() {
  const { albumId, imageId } = useParams();
  const [album, setAlbum] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [sticker, setSticker] = useState(null);
  // const [text, setText] = useState(''); 
  // const [editing, setEditing] = useState(false); 

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const id = parseInt(albumId, 10);
        const data = await getKidAlbum(id);
        setAlbum(data);
        const img = data.images.find(img => img.imageId === parseInt(imageId, 10));
        setImage(img);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch album', error);
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId, imageId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
        <p>이미지를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const handleDownload = async () => {
    const canvas = await html2canvas(document.getElementById('image-editor'));
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = `edited-image.jpg`;
    link.click();
  };

  // const handleStickerSelect = (sticker) => {
  //   setSticker(sticker);
  // };

  // const handleTextChange = (e) => {
  //   setText(e.target.value);
  // };

  // const handleTextSubmit = (e) => {
  //   e.preventDefault();
  //   setEditing(false);
  // };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
      <div className="flex flex-1 flex-col mt-32 mb-16 items-center px-6 w-full">
        <div id="image-editor" className="relative w-full max-w-3xl bg-white shadow-lg rounded-[20px] overflow-hidden">
          <img
            src={image.path}
            alt={`앨범 이미지 ${image.imageId}`}
            className="w-full h-[500px] object-cover rounded-[20px]"
          />
          {/* {sticker && (
            <img
              src={sticker}
              alt="스티커"
              className="absolute top-4 left-4 w-16 h-16"
            />
          )} */}
          {/* {text && (
            <p className="absolute bottom-4 left-4 text-white text-2xl">{text}</p>
          )} */}
        </div>
        {/* <div className="mt-4">
          {editing ? (
            <form onSubmit={handleTextSubmit}>
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                className="border p-2 rounded"
                placeholder="텍스트 입력"
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
                완료
              </button>
            </form>
          ) : (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
              텍스트 추가
            </button>
          )}
        </div> */}
        {/* <div className="flex space-x-4 mt-4">
          <img
            src="sticker1.png"
            alt="스티커1"
            className="w-16 h-16 cursor-pointer"
            onClick={() => handleStickerSelect('sticker1.png')}
          />
          <img
            src="sticker2.png"
            alt="스티커2"
            className="w-16 h-16 cursor-pointer"
            onClick={() => handleStickerSelect('sticker2.png')}
          /> */}
          {/* 필요한 만큼 스티커 추가 */}
        </div>
        <button 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleDownload}
        >
          <FiDownload className="w-6 h-6" />
        </button>
      {/* </div> */}
    </div>
  );
}
