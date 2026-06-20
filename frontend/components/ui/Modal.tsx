"use client";

import React, { useEffect, useRef } from "react";
import { trapFocus } from "../../lib/accessibility";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ""
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Esc key closes the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Auto focus modal wrapper for accessibility
      modalRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop click blocker */}
      <div className="fixed inset-0" onClick={onClose} />
      
      <div
        ref={modalRef}
        onKeyDown={(e) => trapFocus(e, modalRef as unknown as React.RefObject<HTMLElement>)}
        tabIndex={-1}
        className={`relative bg-white border border-border rounded-2xl p-6 shadow-2xl max-w-md w-full focus:outline-none ${className}`}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 id="modal-title" className="font-display text-sm font-bold text-text-deep">
            {title || "Modal Info Dialog"}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-deep text-lg font-bold p-1 transition-smooth"
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        
        <div className="text-xs text-text-deep leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;
