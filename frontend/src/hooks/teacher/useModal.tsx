import { useState, ReactNode, useEffect } from "react";
import ReactModal from "react-modal";
import { useLocation } from "react-router-dom";

ReactModal.setAppElement('#root');

// 기본 스타일 설정
ReactModal.defaultStyles.overlay = {
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  zIndex: '1000',
};

ReactModal.defaultStyles.content = {
  top: '50%',
  left: '50%',
  right: 'auto',
  bottom: 'auto',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'visible',
};

type UseModalReturn = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  Modal: () => JSX.Element;
  isModalOpen: boolean;
};

export default function useModal(): UseModalReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const location = useLocation();

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';  // 모달이 열리면 스크롤 잠금
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
    document.body.style.overflow = '';  // 모달이 닫히면 스크롤 복원
  };

  // 경로가 변경될 때 모달을 자동으로 닫기
  useEffect(() => {
    closeModal();
  }, [location]);

  // 모달이 닫힐 때 스크롤을 복원 (중복된 로직 제거)
  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  const Modal = () => (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="p-5">
        {modalContent}
      </div>
    </ReactModal>
  );

  const customModalStyles: ReactModal.Styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      overflow: "auto",
      maxHeight: "90vh",  // 최대 높이 설정
      maxWidth: "90vw",   // 최대 너비 설정
    },
  };

  return {
    openModal,
    closeModal,
    Modal,
    isModalOpen
  };
}
