"use client";

import React from "react";
import { Modal } from "./Modal";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  className = ""
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className={className}>
      <div className="space-y-6">
        <p className="text-xs text-text-muted leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border text-text-muted text-xs font-semibold rounded-full hover:bg-[#F1F8E9] transition-smooth"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-text-deep text-white text-xs font-semibold rounded-full hover:bg-text-deep/90 transition-smooth"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmationDialog;
