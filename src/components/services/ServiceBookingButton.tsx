"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

const INSTAGRAM_DM_URL =
  "https://ig.me/m/hitomi.l.s_sapporo";

interface Props {
  serviceName: string;
  servicePrice: string;
}

export default function ServiceBookingButton({
  serviceName,
  servicePrice,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = `Hi Hitomi! I'm interested in booking your "${serviceName}" service (${servicePrice}). Could you let me know your availability and more details? Thank you!`;

  function handleConfirm() {
    navigator.clipboard.writeText(message).catch(() => {});
    setCopied(true);
    setTimeout(() => {
      window.open(INSTAGRAM_DM_URL, "_blank", "noopener,noreferrer");
      setOpen(false);
      setCopied(false);
    }, 800);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 w-full inline-flex items-center justify-center font-sans text-xs uppercase tracking-widest px-8 py-3.5 bg-[#A8796A] text-white border border-[#A8796A] hover:bg-[#C9A99A] hover:border-[#C9A99A] transition-all duration-200 cursor-pointer"
      >
        Book this service
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative bg-white max-w-md w-full p-8 shadow-xl">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#7A7570] hover:text-[#2C2C2C] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-3">
              Ready to Book?
            </p>
            <h2 className="font-serif text-2xl font-light text-[#2C2C2C]">
              {serviceName}
            </h2>
            <div className="mt-3 h-px w-10 bg-[#B8A080]" />

            <p className="mt-5 font-sans text-sm text-[#7A7570] leading-relaxed">
              This will open Instagram and copy the message below to your
              clipboard — just paste it in the chat with Hitomi.
            </p>

            {/* Pre-composed message preview */}
            <div className="mt-4 bg-[#FAF7F5] border border-[#EDD9D1] p-4">
              <p className="font-sans text-xs text-[#7A7570] leading-relaxed italic">
                &ldquo;{message}&rdquo;
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center font-sans text-xs uppercase tracking-widest px-6 py-3.5 bg-transparent text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-widest px-6 py-3.5 bg-[#A8796A] text-white border border-[#A8796A] hover:bg-[#C9A99A] hover:border-[#C9A99A] transition-all duration-200 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Open Instagram
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
