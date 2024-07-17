interface DocumentItemProps {
    title: string;
    content: string;
}

export default function DocumentItem({title, content}: DocumentItemProps){
    return <>
        <div className="my-3">
            <span className="font-bold mr-5">{title}</span>
            <span>{content}</span>
        </div>
    </>
}