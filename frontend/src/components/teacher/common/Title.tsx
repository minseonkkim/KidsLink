interface TitleProps {
    title: string;
}

export default function Title({title}: TitleProps){
    return <>
        <p className="text-[36px] font-bold text-center text-[#363636] m-8">
          {title}
        </p>
    </>
}