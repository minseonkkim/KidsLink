import { useEffect } from "react";

interface ModalProps {
  message: string;
  onClose: () => void;
}

export default function Modal({ message, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClose(); // Enter 키가 눌리면 모달을 닫음
      }
    };

    // 컴포넌트가 마운트될 때 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="mb-6 text-center">{message}</p>
        <div className="flex justify-center">
          <button
            className="bg-[#FFC107] text-white py-2 px-4 rounded-lg" 
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
