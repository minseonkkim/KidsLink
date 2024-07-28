import splash from '../../assets/parent/splash.png';

const Splash: React.FC = () => {
  return (
    <div className="font-Cafe24Ssurround min-h-[100vh] w-full flex flex-col justify-center items-center bg-[#7b87cf] mx-auto">
      <p className="text-[30px] mb-10 sm:text-[35px] md:text-[40px] lg:text-[50px] font-bold text-center text-white px-4">
        <span className="block">소중한 아이들</span>
        <span className="block">행복한 성장을</span>
        <span className="block">위한 유치원과</span>
        <span className="block">학부모의 연결</span>
      </p>
      <div className="w-full sm:w-[80%] md:w-[580px] overflow-hidden">
        <img
          src={splash}
          className="w-full h-auto object-cover animate-slideIn"
          alt="Splash Image"
        />
      </div>
    </div>
  );
}

export default Splash;
