"use client";

interface VideoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  videoSrc?: string;
}

export default function VideoModal({ open, setOpen, videoSrc }: VideoModalProps) {
  if (!open) return null;

  return (
    <div
      className="video-modal"
      onClick={() => setOpen(false)}
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
      <div onClick={(e) => e.stopPropagation()}>
        {videoSrc && (
          <video
            controls
            autoPlay
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
