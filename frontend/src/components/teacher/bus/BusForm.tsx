import React, { useState } from "react";
import { postBusStart } from "../../../api/bus";
import { startWebSocket, stopWebSocket } from "../../../api/webSocket";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

interface BusFormProps {
  busId: number | null;
  action: '출발' | '도착';
  isWebSocketActive: boolean;
  setIsWebSocketActive: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
}

export default function BusForm({
  busId,
  action,
  isWebSocketActive: initialWebSocketActive,
  setIsWebSocketActive,
  closeModal
}: BusFormProps) {
  const [selectedOption, setSelectedOption] = useState<'등원' | '하원'>('등원');
  const [isWebSocketActive, setIsWebSocketActiveLocal] = useState<boolean>(initialWebSocketActive);

  const handleOptionChange = (option: '등원' | '하원') => {
    setSelectedOption(option);
  };

  const startWebSocketConnection = () => {
    if (busId) {
      startWebSocket(WEBSOCKET_URL, busId, selectedOption);
      setIsWebSocketActive(true);
      setIsWebSocketActiveLocal(true);
      localStorage.setItem('isWebSocketActive', 'true');
    }
  };

  const stopWebSocketConnection = () => {
    stopWebSocket();
    setIsWebSocketActive(false);
    setIsWebSocketActiveLocal(false);
    localStorage.setItem('isWebSocketActive', 'false');
  };

  return (
    <>
      {isWebSocketActive ? (
        <p className="text-gray-700 mb-6">학부모에게 버스 {action} 알림을 전송하시겠습니까?</p>
      ) : (
        <>
          <p>등·하원을 선택해주세요.</p>
          <div className="lg:left-[150px] rounded-[10px] w-auto pb-3">
            <div className="flex py-1 space-x-4">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="radio"
                  name="busOption"
                  value="등원"
                  checked={selectedOption === '등원'}
                  onChange={() => handleOptionChange('등원')}
                />
                <span className="ml-2">등원</span>
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="radio"
                  name="busOption"
                  value="하원"
                  checked={selectedOption === '하원'}
                  onChange={() => handleOptionChange('하원')}
                />
                <span className="ml-2">하원</span>
              </label>
            </div>
          </div>
          <p className="text-gray-700 mb-6">학부모에게 버스 {action} 알림을 전송하시겠습니까?</p>
        </>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            if (action === '출발' && busId) {
              postBusStart(busId);
              startWebSocketConnection(); // 선택한 등원/하원 옵션을 함께 웹소켓으로 전송
            } else if (action === '도착') {
              stopWebSocketConnection();
            }
            closeModal();
          }}
          className="px-4 py-2 border-[2px] border-[#7C7C7C] bg-[#E3EEFF] font-bold rounded-[10px] shadow-md hover:bg-[#D4DDEA] transition duration-300 ease-in-out"
        >
          전송
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-neutral-300 border-[2px] border-[#7C7C7C] text-black font-semibold rounded-lg shadow-md hover:bg-neutral-400 transition duration-300 ease-in-out"
        >
          취소
        </button>
      </div>
    </>
  );
}
