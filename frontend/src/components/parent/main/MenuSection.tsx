import React from "react";
import MenuItem from "./parent/main/MenuItem";
import mailbox from "../assets/mailbox.png";
import openedFolder from "../assets/opened-folder.png";
import picture from "../assets/picture.png";
import shuttleBus from "../assets/shuttle-bus.png";
import videoConference from "../assets/video-conference.png";
import productDocuments from "../assets/product-documents.png";

const MenuSection: React.FC = () => {
  return (
    <div className="menu-section">
      <MenuItem icon={mailbox} text="알림장" />
      <MenuItem icon={openedFolder} text="성장일기" />
      <MenuItem icon={picture} text="앨범" />
      <MenuItem icon={shuttleBus} text="버스" />
      <MenuItem icon={videoConference} text="상담" />
      <MenuItem icon={productDocuments} text="서류공유" />
    </div>
  );
};

export default MenuSection;
