import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, X, FileText, Share2, Sparkles } from 'lucide-react';
import autoTable from 'jspdf-autotable';

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

        autoTable(doc, {
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

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Begena Fast Track Training',
                    text: `I just registered for the sacred art of Begena training! Join me on this spiritual journey.`,
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
                        className="relative w-full max-w-md glass rounded-4xl p-8 border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px] -z-10" />

                        <div className="text-center relative z-10">
                            <div className="relative inline-block mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                    className="w-20 h-20 rounded-3xl bg-linear-to-br from-brand-red to-brand-red-light flex items-center justify-center shadow-xl shadow-brand-red/30 mx-auto"
                                >
                                    <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
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
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-brand-red" />
                                    <span className="text-brand-red text-[10px] font-black uppercase tracking-widest">Registration Secured</span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Welcome to the Path, <br /><span className="text-brand-red italic font-heading">{userData?.fullName}!</span></h2>
                                <p className="text-white/40 text-[13px] leading-relaxed mb-8 max-w-[280px] mx-auto font-light">
                                    Your journey into the sacred art of Begena has officially begun. Check your Telegram <span className="text-white font-bold">{userData?.telegram}</span> for details.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red transition-all">
                                        <Download className="w-4 h-4 text-brand-red group-hover:text-white" />
                                    </div>
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white">Save Receipt</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-red/30 hover:bg-brand-red/5 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center group-hover:bg-brand-red transition-all">
                                        <Share2 className="w-4 h-4 text-brand-red group-hover:text-white" />
                                    </div>
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white">Share Journey</span>
                                </button>
                            </motion.div>

                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 p-2 text-white/20 hover:text-white hover:rotate-90 transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
