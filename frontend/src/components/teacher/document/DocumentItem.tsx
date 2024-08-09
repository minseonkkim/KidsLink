interface DocumentItemProps {
    title: string;
    content: string | React.ReactNode;
}

export default function DocumentItem({ title, content }: DocumentItemProps) {
    return (
        <div className="flex items-start mb-4">
            <div className="w-[120px] font-bold">{title}</div> {/* 타이틀 너비 고정 */}
            <div className="flex-1">{content}</div> {/* 나머지 공간을 차지하는 콘텐츠 */}
        </div>
    );
}
