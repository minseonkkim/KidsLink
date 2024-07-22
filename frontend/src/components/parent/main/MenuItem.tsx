interface MenuItemProps {
  src: string;
  label: string;
  link: string;
  onClick: (link: string) => void;
}

export default function MenuItem({ src, label, link, onClick }: MenuItemProps) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => onClick(link)}
    >
      <div className="w-[28vw] h-[10vh] flex items-center justify-center bg-[#FFF9D7] rounded-full hover:bg-[#FFEC8A] transition-all duration-200">
        <img
          src={src}
          className="w-[60px] h-[60px] object-contain animate-scaleUpDown"
        />
      </div>
      <p className="text-center text-base font-medium mt-2">{label}</p>
    </div>
  )
}
