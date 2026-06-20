"use client";

import React from "react";

interface BottomDockProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop catcher */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Bottom sheet content */}
      <div className={`relative w-full max-w-2xl bg-white border-t border-border rounded-t-2xl p-6 shadow-2xl pointer-events-auto transform translate-y-0 transition-transform duration-300 ${className}`}>
        {/* Notch */}
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
        
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-display text-sm font-bold text-text-deep">{title}</h4>
            <button onClick={onClose} className="text-text-muted hover:text-text-deep text-lg font-bold p-1" aria-label="Close dock">
              &times;
            </button>
          </div>
        )}
        
        <div className="text-xs text-text-deep leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
export default BottomDock;
