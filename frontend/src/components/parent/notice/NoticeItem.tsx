interface NoticeItemProps {
  notice: {
    id: number;
    date: string;
    title: string;
  };
  handleClick: (id: number) => void;
}

export default function NoticeItem({ notice, handleClick }: NoticeItemProps) {
  return (
    <div
      className="mx-2 flex flex-col p-4 rounded-2xl bg-[#FFF9D7] hover:bg-[#FFEC8A] transition-transform duration-200 transform hover:scale-105 hover:-translate-y-1 shadow-lg cursor-pointer"
      onClick={() => handleClick(notice.id)}
      style={{ 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        transform: 'rotateX(10deg)', 
        perspective: '1000px',
        border: '2px solid #FFEC8A'
      }}
    >
      <p className="text-base font-bold text-[#757575]">{notice.date}</p>
      <p className="text-lg font-medium text-[#212121]">{notice.title}</p>
    </div>
  )
}
