// ModalComponent.tsx
import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { useLocation } from 'react-router-dom';
import useModalStore from '../../../stores/teacher/ModalStore';

ReactModal.setAppElement('#root');

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
    top: "200px",
    left: "500px",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    overflow: "auto",
  },
};

const ModalComponent = () => {
  const { isModalOpen, modalContent, closeModal } = useModalStore();
  const location = useLocation();

  useEffect(() => {
    closeModal(); // 페이지 이동 시 모달 닫기
  }, [location, closeModal]);

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customModalStyles}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="p-6">
        {modalContent}
      </div>
    </ReactModal>
  );
};

export default ModalComponent;
