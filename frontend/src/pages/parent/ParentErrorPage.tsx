import { useNavigate } from 'react-router-dom';
import daramgisad from '../../assets/common/crying-daramgi.png'


export default function ParentErrorPage() {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate('/')
    }
    
    return(
        <>

            <div className="flex h-screen">
                <div className="m-auto text-center w-60">
                    <img src={daramgisad} alt="daramgisad" />
                    <p className="text-3xl text-center">존재하지 않는</p> 
                    <p className="text-3xl text-center">페이지입니다.</p>
                    <div className="mt-4 space-y-2">
                        <div className="block">
                            <div className="inline-block text-center border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]">
                                <button onClick={navigateToHomePage}>첫 화면으로 돌아가기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
