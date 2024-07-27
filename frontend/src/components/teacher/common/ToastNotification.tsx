import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  return <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />;
};

export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, options);
};

export const showToastError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

export default ToastNotification;
