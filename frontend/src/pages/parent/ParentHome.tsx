import React from 'react';
import daramgi from '../../assets/parent/home/daramgi.png';
import openedFolder from '../../assets/parent/home/opened-folder.png';
import picture from '../../assets/parent/home/picture.png';
import shttleBus from '../../assets/parent/home/shuttle-bus.png';
import videoConference from '../../assets/parent/home/video-conference.png';
import productDocuments from '../../assets/parent/home/product-documents.png';
import mailbox from '../../assets/parent/home/mailbox.png';

export default function ParentHome() {
  return (
    <div className="w-[455px] h-[900px] relative overflow-hidden bg-[#fff9d7] font-KoPubDotum">
      <div className="w-[393px] h-[289px] absolute left-[42px] top-[94px]">
        <img
          src={daramgi}
          alt='daramgi'
          className="w-[179px] h-[289px] absolute left-[213px] top-[-1px] object-cover transition duration-300 transform hover:scale-110"
        />
        <div className="w-[214px] h-24 absolute left-0 top-[60px]">
          <p className="w-[210px] absolute left-px top-11 text-[31px] font-medium text-left text-[#212121]">
            만나서 반가워요!
          </p>
          <p className="w-[214px] absolute left-0 top-0 text-[31px] text-left text-[#212121]">
            <span className="w-[214px] text-[31px] font-bold text-left text-[#212121]">김민선 </span>
            <span className="w-[214px] text-[31px] font-medium text-left text-[#212121]">학부모님</span>
          </p>
        </div>
      </div>
      <div className="w-[455px] h-[550px] absolute left-0 top-[350px]">
        <div
          className="w-[455px] h-[550px] absolute left-[-1px] top-[-1px] rounded-tl-[40px] rounded-tr-[40px] bg-white"
          style={{
            boxShadow:
              "0px 54px 55px 0 rgba(0,0,0,0.25), 0px -12px 30px 0 rgba(0,0,0,0.12), 0px 4px 6px 0 rgba(0,0,0,0.12), 0px 12px 13px 0 rgba(0,0,0,0.17), 0px -3px 5px 0 rgba(0,0,0,0.09)",
          }}
        />
        <p className="absolute left-[110px] top-[77px] text-[22px] font-bold text-left text-[#212121]">
          어떤 서비스가 필요하세요?
        </p>
        <div className="w-[75px] h-[114px] absolute left-[203px] top-[169px]">
          <p className="absolute left-0 top-[83px] text-xl font-medium text-left text-[#212121]">
            성장일지
          </p>
          <img
            src={openedFolder}
            alt='opened_folder'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
        <div className="w-[75px] h-[114px] absolute left-[332px] top-[169px]">
          <p className="absolute left-5 top-[83px] text-xl font-medium text-left text-[#212121]">
            앨범
          </p>
          <img
            src={picture}
            alt='album'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
        <div className="w-[75px] h-[117px] absolute left-[67px] top-[306px]">
          <p className="absolute left-[7px] top-[86px] text-xl font-medium text-left text-[#212121]">
            등하원
          </p>
          <img
            src={shttleBus}
            alt='shuttle_bus'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
        <div className="w-[75px] h-[117px] absolute left-[203px] top-[306px]">
          <p className="absolute left-5 top-[86px] text-xl font-medium text-left text-[#212121]">
            상담
          </p>
          <img
            src={videoConference}
            alt='video_conference'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
        <div className="w-[75px] h-[117px] absolute left-[332px] top-[306px]">
          <p className="absolute left-[3px] top-[86px] text-xl font-medium text-left text-[#212121]">
            문서공유
          </p>
          <img
            src={productDocuments}
            alt='product-documents'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
        <div className="w-[75px] h-[114px] absolute left-[59px] top-[169px]">
          <p className="absolute left-[15px] top-[83px] text-xl font-medium text-left text-[#212121]">
            알림장
          </p>
          <img
            src={mailbox}
            alt='mailbox'
            className="w-[75px] h-[75px] absolute left-[-1px] top-[-1px] object-contain transition duration-300 transform hover:scale-110"
          />
        </div>
      </div>
      <div className="w-[455px] h-[67px] absolute left-0 top-0 shadow-md">
        <p className="w-[99px] absolute left-[26px] top-4 text-[26px] font-bold text-left gradient-text">아이샘톡</p>
      </div>
    </div>
  )
}
