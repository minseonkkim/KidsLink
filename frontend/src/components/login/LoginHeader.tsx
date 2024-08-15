import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

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
    return (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between h-[85px] bg-[#fff9d7] shadow-md z-50">
            <Link to="/"><p className="ml-[150px] text-[40px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p></Link>
            <div className="mr-[150px] text-[18px]">
                <Link to="/login"><button className="mr-5">로그인</button></Link>
                <Link to="/join"><button>회원가입</button></Link>
            </div>
        </div>
    );
};

const TabletOrMobileComponent = () => {
    return (
        <div className="fixed top-0 left-0 right-0 w-full h-[67px] border-b border-gray-300 p-4 shadow-md flex items-center justify-between bg-[#fff9d7] z-50">
            <p className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
        </div>
    );
};

