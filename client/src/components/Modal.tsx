import React, { ReactNode, MouseEvent } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-0">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-white rounded-full shadow p-2 text-2xl hover:bg-gray-100 transition z-10"
          aria-label="إغلاق"
        >
          ×
        </button>
        <div className="flex flex-col items-center pt-10 pb-6 px-6 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal; 