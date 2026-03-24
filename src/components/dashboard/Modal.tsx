"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnOutsideClick?: boolean;
}

export default function Modal({ open, onClose, closeOnOutsideClick = true, children }: ModalProps) {
  return (
    <div
      className={`fixed z-50 inset-0 flex justify-center items-center transition-all duration-300
      ${open ? "visible bg-foreground/20 backdrop-blur-sm" : "invisible"}
      `}
      onClick={closeOnOutsideClick ? onClose : () => {}}
      onKeyDown={(e) => {
        if (e.key === "Escape" && closeOnOutsideClick) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className={`relative bg-card border border-border rounded-2xl shadow-2xl p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto
        ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground bg-secondary hover:bg-secondary/80 hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
