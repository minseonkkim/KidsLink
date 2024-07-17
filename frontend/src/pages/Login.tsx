import LoginHeader from '../components/login/LoginHeader';
import mainImg from '../assets/main_img.png';                       

export default function Login(){
    return <>
        <LoginHeader/>
        <div className="bg-[#fff9d7] min-h-[calc(100vh-105px)] h-full font-KoPubDotum z-1">
            <div>
                <p className="absolute left-[180px] top-[255px] text-[47px] font-bold text-left text-[#363636]">
                    소중한 추억을 기록하며,
                    <br />
                    교육의 모든 순간을 함께하세요.
                </p>


                <form className="absolute left-[180px] top-[490px] flex flex-col">
                    <input type="text" placeholder="로그인" className="w-[530px] h-[78px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-3 text-[26px] font-medium text-left text-[#b9b9b9]"/>
                    <input type="password" placeholder="비밀번호" className="w-[530px] h-[78px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-5 text-[26px] font-medium text-left text-[#b9b9b9]"/>
                    <button className="w-[530px] h-[67px] rounded-[20px] bg-[#ffe96f] text-[30px] font-bold mb-3">로그인</button>
                    <p className="text-[23px] font-medium text-left text-[#363636]">아이샘톡이 처음이라면?</p>
                </form>
            </div>

            <img
                src={mainImg}
                className="w-[800px] absolute left-[930px] top-[220px] object-cover"
            />
        </div>
            
 
    </>
}
