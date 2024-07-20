interface TitleProps {
    title: string;
}

export default function Title({title}: TitleProps){
    return <>
        <p className="text-[36px] font-bold text-center text-[#363636] mt-8 mb-5">
          {title}
        </p>
    </>
}