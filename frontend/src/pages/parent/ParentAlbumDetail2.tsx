// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Slider from 'react-slick';
// import { getKidAlbum } from '../../api/album';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function AlbumDetail() {
//   const { albumId } = useParams();
//   const navigate = useNavigate();
//   const [album, setAlbum] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("albumId: ", albumId)
//     const fetchAlbum = async () => {
//       try {
//         const id = parseInt(albumId, 10); // albumId를 다른 이름으로 파싱
//         if (isNaN(id)) {
//           throw new Error('Invalid albumId');
//         }
//         const data = await getKidAlbum(id);
//         setAlbum(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch album', error);
//         setLoading(false);
//       }
//     };

//     fetchAlbum();
//   }, [albumId]);

//   if (loading) {
//     return (
//       <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (!album) {
//     return (
//       <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-white">
//         <p>앨범을 불러오지 못했습니다.</p>
//       </div>
//     );
//   }

//   const settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//   };

//   const handleImageClick = (imageId) => {
//     navigate(`/album/${albumId}/image/${imageId}`);
//   };

//   return (
//     <div className="min-h-[100dvh] flex flex-col justify-between bg-white">
//       <div className="flex flex-1 flex-col my-16 items-center px-6 w-full">
//         <h2 className="text-2xl font-bold mt-10 mb-4">{album.albumName}</h2>
//         <p className="text-sm text-gray-600 mb-8">{new Date(album.albumDate).toLocaleDateString()}</p>
//         <div className="w-full max-w-3xl">
//           <Slider {...settings}>
//             {album.images.map((image) => (
//               <div
//                 key={image.imageId}
//                 className="relative w-full group bg-white shadow-lg rounded-[20px] overflow-hidden transition-transform duration-200 ease-in-out transform hover:scale-105"
//                 onClick={() => handleImageClick(image.imageId)}
//               >
//                 <img
//                   src={image.path}
//                   alt={`앨범 이미지 ${image.imageId}`}
//                   className="w-full h-[500px] object-cover rounded-[20px]"
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </div>
//   );
// }
