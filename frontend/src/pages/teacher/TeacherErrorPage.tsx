import { useNavigate } from 'react-router-dom';
import daramgisad from '../../assets/common/crying-daramgi.png'
// import TeacherHeader from '../../components/teacher/common/TeacherHeader'

export default function TeacherErrorPage() {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate('/')
    }
    return(
        <>
            {/* <TeacherHeader /> */}
            <div className="flex h-screen">
                <div className="m-auto text-center">
                    <div className='flex items-center justify-center'>
                        <img src={daramgisad} alt="daramgisad" className='h-[270px] mb-[30px]' />
                    </div>
                    
                    <p className="text-[25px] font-bold">존재하지 않는 페이지입니다.</p>
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
