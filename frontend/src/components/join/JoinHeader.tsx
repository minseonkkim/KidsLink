import { useNavigate } from "react-router-dom";

export default function JoinHeader() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <p
        className="text-[30px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer"
        onClick={handleHomeClick}
      >
        키즈링크
      </p>
    </header>
  );
}
