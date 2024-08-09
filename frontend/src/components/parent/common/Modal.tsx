interface ModalProps {
  message: string;
  onClose: () => void;
}

export default function Modal({ message, onClose }: ModalProps) {
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
