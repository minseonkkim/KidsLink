import create from 'zustand';
import { ReactNode } from 'react';

type ModalState = {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  openModal: (content: ReactNode) => set({ modalContent: content, isModalOpen: true }),
  closeModal: () => set({ modalContent: null, isModalOpen: false }),
}));

export default useModalStore;
