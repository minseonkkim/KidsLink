import { useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";
import MobileScreenImg from "../../assets/teacher/mobile_screen.png";
import DesktopScreenImg from "../../assets/teacher/desktop_screen.png";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import albumIcon from "../../assets/teacher/album_btn_img.png";
import busIcon from "../../assets/teacher/bus_btn_img.png";
import consultingIcon from "../../assets/teacher/consulting_btn_img.png";
import noticeIcon from "../../assets/teacher/notice_btn_img.png";
import growthdiaryIcon from "../../assets/teacher/growthdiary_btn_img.png";
import documentIcon from "../../assets/teacher/document_btn_img.png";

export default function LandingPage() {
    const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true });
    const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true });
    const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true });
    const { ref: ref4, inView: inView4 } = useInView({ triggerOnce: true });
  
    const mobileAnimation = useAnimation();
    const desktopAnimation = useAnimation();
    const mobileTextAnimation = useAnimation();
    const desktopTextAnimation = useAnimation();
    const finalTextAnimation = useAnimation();
    const featureAnimations = [useAnimation(), useAnimation(), useAnimation(), useAnimation(), useAnimation(), useAnimation()];
    const testimonialAnimation = useAnimation();
    const finalSectionAnimation = useAnimation();
  
    useEffect(() => {
      if (inView1) {
        mobileAnimation
          .start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.35 },
          })
          .then(() => {
            return mobileTextAnimation.start({
              opacity: 1,
              y: 0,
              color: "#363636",
              transition: { duration: 0.35 },
            });
          })
          .then(() => {
            return desktopAnimation.start({
              opacity: 1,
              x: 0,
              transition: { duration: 0.35 },
            });
          })
          .then(() => {
            return desktopTextAnimation.start({
              opacity: 1,
              y: 0,
              color: "#363636",
              transition: { duration: 0.35 },
            });
          })
          .then(() => {
            return finalTextAnimation.start({
              opacity: 1,
              y: 0,
              color: "#363636",
              transition: { duration: 0.35 },
            });
          });
      }
    }, [inView1, mobileAnimation, desktopAnimation, mobileTextAnimation, desktopTextAnimation, finalTextAnimation]);
  
    useEffect(() => {
      if (inView2) {
        featureAnimations.forEach((animation, index) => {
          animation.start({
            opacity: 1,
            x: 0,
            transition: { type: 'spring', duration: 0.6 + index * 0.2, bounce: 0.3 },
          });
        });
      }
    }, [inView2, featureAnimations]);
  
    useEffect(() => {
      if (inView3) {
        testimonialAnimation.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.8 },
        });
    
        const testimonialDivs = document.querySelectorAll('.testimonial-item');
        testimonialDivs.forEach((div, index) => {
          setTimeout(() => {
            (div as HTMLElement).style.opacity = '1';
            (div as HTMLElement).style.transform = 'translateY(0)';
          }, index * 200); // delay between each div animation
        });
      }
    }, [inView3, testimonialAnimation]);
    
  
    useEffect(() => {
      if (inView4) {
        finalSectionAnimation.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.8 },
        });
      }
    }, [inView4, finalSectionAnimation]);
  
    return (
      <div className="landing-page">
        <style>
          {`
            @keyframes upwardBounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-15px);
              }
              60% {
                transform: translateY(-10px);
              }
            }

            .upward-bounce {
              animation: upwardBounce 2s infinite;
            }
          `}
        </style>

        <section className="first-section min-h-screen relative bg-gradient-to-b from-blue-50 to-white">
          <div className="content-container" ref={ref1}>
            <div className="relative flex flex-col md:flex-row items-center h-full">
              <motion.img
                src={MobileScreenImg}
                alt="부모님을 위한 서비스"
                className="w-[27%] mb-10 absolute top-[130px] left-[130px]"
                initial={{ opacity: 0, x: -100 }}
                animate={mobileAnimation}
              />
              <motion.img
                src={DesktopScreenImg}
                alt="선생님을 위한 서비스"
                className="w-[52%] absolute top-[305px] right-[130px]"
                initial={{ opacity: 0, x: 100 }}
                animate={desktopAnimation}
              />
            </div>
            <div className="absolute top-[90px] right-[40%] mt-8 text-[30px] text-center font-bold leading-relaxed">
              <motion.p
                initial={{ opacity: 0.3, y: 20, color: "#d3d3d3" }}
                animate={mobileTextAnimation}
              >
                부모님을 위한 앱 서비스
              </motion.p>
              <motion.p
                initial={{ opacity: 0.3, y: 20, color: "#d3d3d3" }}
                animate={desktopTextAnimation}
              >
                선생님을 위한 웹 서비스로
              </motion.p>
              <motion.p
                initial={{ opacity: 0.3, y: 20, color: "#d3d3d3" }}
                animate={finalTextAnimation}
              >
               편의성을 높였어요!
              </motion.p>
            </div>
          </div>
        </section>
  
        <section className="second-section min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 to-pink-100">
          <div className="content-container" ref={ref2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-[140px] my-[80px]">
              {featureAnimations.map((animation, index) => (
                <motion.div
                  key={index}
                  className="feature-item p-4 bg-white shadow-lg rounded-[20px] flex flex-col items-center transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={animation}
                >
                  <img src={[albumIcon, busIcon, consultingIcon, noticeIcon, growthdiaryIcon, documentIcon][index]} alt="기능 아이콘" className="h-[150px]" />
                  <h3 className="text-[22px] font-semibold mt-4 mb-3">{["사진분류", "등하원관리", "화상상담", "알림장", "성장일지", "서류관리"][index]}</h3>
                  <p className="text-center text-gray-60 text-[15.5px]">
                  {[
                    <span>
                      <strong>AI 얼굴인식</strong>을 통해 아이들의 소중한 순간을<br/>손쉽게 분류하고 관리해요.
                    </span>,
                    <span>
                      실시간 <strong>버스위치확인</strong>, 승하차 체크리스트를 통해<br/>아이들의 등하원을 체계적으로 관리해요.
                    </span>,
                    <span>
                      키즈링크만의 알고리즘으로 <strong>상담일정</strong>을 조율하고, <br/>언제 어디서나 쉽게 상담을 진행하세요.<br/>
                    </span>,
                    <span>
                      종이로 전달하는 알림장은 더 이상 No~!<br/>중요한 정보를 빠르고 정확하게 전달하세요.
                    </span>,
                    <span>
                      아이들의 <strong>소중한 성장 과정</strong>을<br/>사진과 함께 기록하고 공유하세요.
                    </span>,
                    <span>
                      클릭 한번으로 <strong>서류제출</strong> 끝!<br/>결석 및 투약 서류를 간편하게 관리하세요.
                    </span>,
                  ][index]}
                </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
  
        <section className="third-section min-h-screen flex items-center justify-center bg-white">
          <motion.div
            className="content-container text-center"
            ref={ref3}
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialAnimation}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-[50px]">사용자들의 후기가 증명하는 키즈링크</h2>
            <div className="testimonial-container mx-[150px] grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="testimonial-item bg-gray-100 p-6 rounded-[15px] shadow-lg mb-4 flex items-center justify-center flex-col leading-7 opacity-0 translate-y-5 transition-opacity transition-transform duration-500">
                <p className="text-[17px] text-gray-700 mb-2">
                  "아이들의 활동 사진을 학부모님께 전달할 때, 매번 누락된 원아는 없는지, 사진의 수가 균등한지 확인하는 것이 매우 번거로웠습니다. 하지만 얼굴인식을 통해 각 아이의 사진 수를 자동으로 확인하고, 누락된 아이가 있는지 한눈에 파악할 수 있어 매우 유용했습니다."
                </p>
                <p className="text-sm text-gray-500 mt-3">- 사용자 A</p>
              </div>
              <div className="testimonial-item bg-gray-100 p-6 rounded-[15px] shadow-lg mb-4 flex items-center justify-center flex-col leading-7 opacity-0 translate-y-5 transition-opacity transition-transform duration-500">
                <p className="text-[17px] text-gray-700 mb-2">
                  "유치원의 학사일정과 개인일정, 그리고 화상상담 일정을 하나의 달력에서 날짜별로 쉽게 확인할 수 있는 기능이 매우 편리했습니다. 모든 일정을 한눈에 파악할 수 있어 시간을 효율적으로 관리할 수 있었습니다."
                </p>
                <p className="text-sm text-gray-500 mt-3">- 사용자 B</p>
              </div>
              <div className="testimonial-item bg-gray-100 p-6 rounded-[15px] shadow-lg mb-4 flex items-center justify-center flex-col leading-7 opacity-0 translate-y-5 transition-opacity transition-transform duration-500">
                <p className="text-[17px] text-gray-700 mb-2">
                  "등하원 차량의 실시간 위치를 확인할 수 있어 매우 만족스러웠습니다. 학부모님들이 차량 도착 시간을 막연히 기다리기보다, 실시간 위치 정보를 통해 아이들을 준비시킬 수 있어 더 효율적이고 안심이 됩니다."
                </p>
                <p className="text-sm text-gray-500 mt-3">- 사용자 C</p>
              </div>
            </div>
          </motion.div>
        </section>
  
        <section className="fourth-section min-h-screen flex items-center justify-center bg-gray-100">
          <motion.div
            className="content-container text-center"
            ref={ref4}
            initial={{ opacity: 0, y: 50 }}
            animate={finalSectionAnimation}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8">편리함 그 이상을 제공합니다.</h2>
            <p className="text-xl text-gray-600 mb-8 leading-9">
              키즈링크는 학부모와 선생님 모두에게 편리하고, 효율적인 교육 관리 서비스를 제공합니다.<br/>
              키즈링크만의 기능과 함께 아이들의 성장을 기록하고, 중요한 정보를 쉽게 공유하세요.
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
              지금 시작하기
            </button>
            <div className="flex justify-center mt-10">
              <FaChevronUp
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[24px] text-[#b1b1b1] cursor-pointer hover:text-gray-800 transition-colors duration-200 upward-bounce" 
              />
            </div>
          </motion.div>
        </section>
      </div>
    );
}
