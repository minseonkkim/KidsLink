interface MenuButtonProps {
  src: string;
  alt: string;
  label: string;
  position: string;
}


export default function MenuButton({ src, alt, label, position }: MenuButtonProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-[75px] h-[114px] absolute ${position}`}>
      <img
        src={src}
        alt={alt}
        className="w-[75px] h-[75px] object-contain transition duration-300 transform hover:scale-110"
      />
      <p className="text-xl font-medium text-center text-[#212121] mt-[5px]">
        {label}
      </p>
    </div>
  );
}
