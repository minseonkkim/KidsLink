import { useMediaQuery } from 'react-responsive';

export default function LoginHeader(){
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 740px)' });
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 740px)' });

    return (
        <>
        {isDesktopOrLaptop && <DesktopComponent />}
        {isTabletOrMobile && <TabletOrMobileComponent />}
        </>
    );
}


const DesktopComponent = () => {
    return <>
        <div className="fixed flex items-center justify-between h-[85px] bg-[#fff9d7] relative shadow-md z-10">
            <p className="ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
        </div>
    </>
}

const TabletOrMobileComponent = () => {
    return <>
         <div className="fixed w-full h-[67px] border-b border-gray-300 p-4 shadow-md flex items-center justify-between bg-[#fff9d7]">
            <p className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
        </div>
    </>
}