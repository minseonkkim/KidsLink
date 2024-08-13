import { useNavigate } from 'react-router-dom';
import daramgisad from '../../assets/common/crying-daramgi.png';

interface ErrorPageProps {
    message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#f8f9fa]">
            <div className="m-auto text-center">
                <img 
                    src={daramgisad} 
                    alt="daramgisad" 
                    className="h-[200px] mb-6 mx-auto" 
                />
                <p className="text-[22px] font-bold text-[#333] mb-4">
                    {message}
                </p>
                <button 
                    onClick={navigateToHomePage} 
                    className="text-[16px] font-semibold text-white bg-[#C0D290] px-6 py-2 rounded-[8px] hover:bg-[#8CAD1E] transition-all duration-200"
                >
                    첫 화면으로 돌아가기
                </button>
            </div>
        </div>
    );
}
