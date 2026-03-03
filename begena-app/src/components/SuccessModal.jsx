import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, X, FileText, Share2, Sparkles } from 'lucide-react';
import 'jspdf-autotable';

const SuccessModal = ({ isOpen, onClose, userData }) => {
    const handleDownloadPDF = () => {
        if (!userData) return;

        const doc = new jsPDF();
        doc.setFillColor(152, 28, 0); // brand-red
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Begena Fast Track', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Registration Receipt', 105, 30, { align: 'center' });

        doc.autoTable({
            startY: 50,
            head: [['Field', 'Details']],
            body: [
                ['Full Name', userData.fullName],
                ['Phone Number', `${userData.countryCode} ${userData.phoneNumber}`],
                ['Telegram Username', userData.telegram],
                ['Date', new Date().toLocaleDateString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [152, 28, 0], textColor: [255, 255, 255] },
            styles: { fontSize: 11, cellPadding: 5 },
        });

        doc.save(`Begena_Receipt_${userData.fullName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-950/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg glass rounded-4xl p-10 border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px] -z-10" />

                        <div className="text-center relative z-10">
                            <div className="relative inline-block mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                    className="w-24 h-24 rounded-3xl bg-linear-to-br from-brand-red to-brand-red-light flex items-center justify-center shadow-xl shadow-brand-red/30"
                                >
                                    <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border-2 border-dashed border-brand-red/20 rounded-full"
                                />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Sparkles className="w-4 h-4 text-brand-red" />
                                    <span className="text-brand-red text-xs font-black uppercase tracking-widest">Registration Secured</span>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Welcome to the Path, <br /><span className="text-brand-red italic font-heading">{userData.fullName}!</span></h2>
                                <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm mx-auto font-light">
                                    Your journey into the sacred art of Begena has officially begun. Check your Telegram <span className="text-white font-bold">{userData.telegram}</span> for orientation details.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red transition-all">
                                        <Download className="w-5 h-5 text-brand-red group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white">Save Receipt</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red transition-all">
                                        <Share2 className="w-5 h-5 text-brand-red group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white">Share Journey</span>
                                </button>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={onClose}
                                className="mt-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] hover:text-brand-red transition-colors"
                            >
                                Close Window
                            </motion.button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-white/20 hover:text-white hover:rotate-90 transition-all duration-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
