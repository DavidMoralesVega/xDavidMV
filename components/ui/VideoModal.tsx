"use client";

import { useEffect, useRef, useCallback } from "react";

interface VideoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  videoSrc?: string;
}

export default function VideoModal({ open, setOpen, videoSrc }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!open) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }

      // Focus trap - keep focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      // Restore focus to previously focused element
      previousActiveElement.current?.focus();
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="video-modal"
      onClick={handleClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <span id="video-modal-title" className="sr-only">
        Reproductor de video
      </span>
      <button
        ref={closeButtonRef}
        onClick={handleClose}
        aria-label="Cerrar video"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "2rem",
          cursor: "pointer",
          padding: "0.5rem",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        {videoSrc && (
          <video
            controls
            autoPlay
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          >
            <source src={videoSrc} type="video/mp4" />
            <track kind="captions" src="" label="Sin subtítulos" />
          </video>
        )}
      </div>
    </div>
  );
}
