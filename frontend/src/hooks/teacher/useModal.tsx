import { useState, ReactNode, useEffect } from "react";
import ReactModal from "react-modal";
import { useLocation } from "react-router-dom";

ReactModal.setAppElement('#root');

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
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  // Close the modal when the route changes
  useEffect(() => {
    closeModal();
  }, [location]);

  const Modal = () => (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="p-6">
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
    },
  };

  return {
    openModal,
    closeModal,
    Modal,
    isModalOpen
  };
}
