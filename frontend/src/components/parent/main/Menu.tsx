import MenuButton from './MenuButton'; 

// 이미지 파일을 import 합니다.
import mailbox from '../../../assets/parent/home/mailbox.png';
import openedFolder from '../../../assets/parent/home/opened-folder.png';
import picture from '../../../assets/parent/home/picture.png';
import shuttleBus from '../../../assets/parent/home/shuttle-bus.png';
import videoConference from '../../../assets/parent/home/video-conference.png';
import productDocuments from '../../../assets/parent/home/product-documents.png';


export default function Menu() {
  return (
    <div>
      <MenuButton
        src={mailbox}
        alt="mailbox"
        label="알림장"
        position="left-[59px] top-[169px]"
      />
      <MenuButton
        src={openedFolder}
        alt="opened_folder"
        label="성장일지"
        position="left-[203px] top-[169px]"
      />
      <MenuButton
        src={picture}
        alt="album"
        label="앨범"
        position="left-[332px] top-[169px]"
      />
      <MenuButton
        src={shuttleBus}
        alt="shuttle_bus"
        label="등하원"
        position="left-[67px] top-[306px]"
      />
      <MenuButton
        src={videoConference}
        alt="video_conference"
        label="상담"
        position="left-[203px] top-[306px]"
      />
      <MenuButton
        src={productDocuments}
        alt="product-documents"
        label="문서공유"
        position="left-[332px] top-[306px]"
      />
    </div>
  );
};

