import { useNavigate } from 'react-router-dom';
import daramgisad from '../../assets/common/daramgisad.png'
// import TeacherHeader from '../../components/teacher/common/TeacherHeader'

export default function TeacherErrorPage() {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate('/')
    }

    const navigateToBeforePage = () => {
        navigate(-1)
    }
    
    return(
        <>
            {/* <TeacherHeader /> */}
            <div className="flex h-screen">
                <div className="m-auto text-center">
                    <img src={daramgisad} alt="daramgisad" />
                    <p className="text-3xl">존재하지 않는 페이지 입니다.</p>
                    <div className="mt-4 space-y-2">
                        <div className="block">
                            <div className="inline-block text-center border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA]">
                                <button onClick={navigateToBeforePage}>이전 페이지로 돌아가기</button>
                            </div>
                        </div>
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
