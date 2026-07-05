"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import WatchForm from "./WatchForm";

interface AdminAddWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAddWatchModal({ isOpen, onClose }: AdminAddWatchModalProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSuccess = () => {
    onClose();
    setKey((k) => k + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed inset-x-4 top-[4%] bottom-[4%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-3xl lg:max-w-4xl z-50 flex flex-col"
          >
            <div className="bg-ld-charcoal border border-ld-gold/20 rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-ld-grey/50 shrink-0">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Add New Watch</h2>
                  <p className="text-ld-silver text-xs sm:text-sm">Fill in the details below</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-ld-silver hover:text-white hover:bg-ld-grey/50 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 sm:px-6 py-5 sm:py-6">
                <WatchForm key={key} onSuccess={handleSuccess} onCancel={onClose} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
