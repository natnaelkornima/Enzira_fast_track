import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm();
        } finally {
            setIsConfirming(false);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm glass rounded-xl p-6 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    disabled={isConfirming}
                                    className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isConfirming}
                                    className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmActionModal;
