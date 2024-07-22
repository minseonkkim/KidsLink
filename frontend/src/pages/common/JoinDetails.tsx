import { useParams } from 'react-router-dom';
import CommonContent from './JoinCommon';
import ParentHeader from '../../components/parent/common/ParentHeader';

interface JoinDetailsProps {
    role: string;
}

export default function JoinDetails({ role }: JoinDetailsProps) {
    const renderContent = () => {
        switch (role) {
            case '선생님':
                return (
                    <div>
                        <button className="my-5 bg-transparent hover:bg-[#B2D170] text-[#B2D170] font-semibold hover:text-white py-2 px-4 border border-[#B2D170] hover:border-transparent rounded hover:!bg-[#B2D170] hover:!text-white hover:!border-transparent">
                            {role}으로 회원가입
                        </button>
                    </div>
                );
            case '학부모':
                return (
                    <div>
                        <button className="my-5 bg-transparent hover:bg-[#B2D170] text-[#B2D170] font-semibold hover:text-white py-2 px-4 border border-[#B2D170] hover:border-transparent rounded hover:!bg-[#B2D170] hover:!text-white hover:!border-transparent">
                            {role}로 회원가입
                        </button>
                    </div>
                );
            case '원장님':
                return (
                    <div>
                        <button className="my-5 bg-transparent hover:bg-[#B2D170] text-[#B2D170] font-semibold hover:text-white py-2 px-4 border border-[#B2D170] hover:border-transparent rounded hover:!bg-[#B2D170] hover:!text-white hover:!border-transparent">
                            {role}으로 회원가입
                        </button>
                    </div>
                );
            default:
                return <h1>역할을 선택해 주세요.</h1>;
        }
    };

    return (
        <div className="max-w-full h-full min-h-screen bg-white flex flex-col items-center py-25">
            <ParentHeader />
            <CommonContent role={role}/>
            {renderContent()}

        </div>
    );
}