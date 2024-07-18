import LoginHeader from '../components/login/LoginHeader';
import mainImg from '../assets/teacher/main_img.png';                       

export default function Login(){
    return <>
        <LoginHeader/>
        <div className="flex flex-row bg-[#fff9d7] min-h-[calc(100vh-85px)] h-full font-KoPubDotum z-1">
            <div className="mx-[150px] py-[100px]">
                <p className="text-[38px] font-bold text-left text-[#363636] mb-[65px]">
                    소중한 추억을 기록하며,
                    <br />
                    교육의 모든 순간을 함께하세요.
                </p>

                <form className="flex flex-col">
                    <input type="text" placeholder="로그인" className="w-[450px] h-[62px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-3 text-[22px] font-medium text-left text-[#b9b9b9]"/>
                    <input type="password" placeholder="비밀번호" className="w-[450px] h-[62px] rounded-[20px] p-5 bg-white border border-[#b9b9b9] mb-5 text-[22px] font-medium text-left text-[#b9b9b9]"/>
                    <button className="w-[450px] h-[62px] rounded-[20px] bg-[#ffe96f] text-[24px] font-bold mb-3">로그인</button>
                    <p className="text-[22px] font-medium text-left text-[#363636]">키즈링크가 처음이라면?</p>
                </form>
            </div>

            <img
                src={mainImg}
                className="w-[630px] absolute left-[650px] top-[180px] object-cover"
            />
        </div>
            
     </>
 }