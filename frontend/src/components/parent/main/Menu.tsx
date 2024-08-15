import MenuItem from "./MenuItem"
import mailbox from "../../../assets/parent/mailbox.png"
import openedFolder from "../../../assets/parent/opened-folder.png"
import picture from "../../../assets/parent/picture.png"
import shuttleBus from "../../../assets/parent/shuttle-bus.png"
import videoConference from "../../../assets/parent/video-conference.png"
import productDocuments from "../../../assets/parent/product-documents.png"

const menus = [
  { src: mailbox, label: "알림장", link: "/notice" },
  { src: openedFolder, label: "성장일지", link: "/growth" },
  { src: picture, label: "앨범", link: "/album" },
  { src: shuttleBus, label: "등하원", link: "/bus" },
  { src: videoConference, label: "상담", link: "/meeting" },
  { src: productDocuments, label: "서류관리", link: "/document" },
]

interface MenuProps {
  onMenuClick: (link: string) => void
}

export default function Menu({ onMenuClick }: MenuProps) {
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {menus.map((menu) => (
        <MenuItem
          key={menu.label}
          src={menu.src}
          label={menu.label}
          link={menu.link}
          onClick={onMenuClick}
        />
      ))}
    </div>
  )
}
