import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, X, FileText } from 'lucide-react';
import 'jspdf-autotable';

const SuccessModal = ({ isOpen, onClose, userData }) => {
    const handleDownloadPDF = () => {
        if (!userData) return;

        const doc = new jsPDF();

        // Add PDF Header content
        doc.setFillColor(30, 20, 10);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(200, 146, 45); // Gold color
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Begena Training Registration', 105, 20, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Registration Receipt', 105, 30, { align: 'center' });

        // User Details Table
        doc.autoTable({
            startY: 50,
            head: [['Field', 'Details']],
            body: [
                ['Registration ID', `#${userData.serverData?.id || 'N/A'}`],
                ['Full Name', userData.fullName],
                ['Phone Number', `${userData.countryCode} ${userData.phoneNumber}`],
                ['Telegram Username', `@${userData.telegram}`],
                ['Date', new Date().toLocaleDateString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [200, 146, 45], textColor: [255, 255, 255] },
            styles: { fontSize: 11, cellPadding: 5 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 100 }
            }
        });

        // Add Photo Preview if available
        if (userData.photo && userData.photo instanceof File) {
            const finalY = doc.lastAutoTable.finalY || 100;
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgData = event.target.result;
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text('Student Photo:', 15, finalY + 15);

                // Add the image (x, y, width, height)
                doc.addImage(imgData, 'JPEG', 15, finalY + 20, 40, 40);

                // Save after image loads
                doc.save(`Begena_Registration_${userData.fullName.replace(/\s+/g, '_')}.pdf`);
            };
            reader.readAsDataURL(userData.photo);
        } else {
            // Document without photo save
            doc.save(`Begena_Registration_${userData.fullName.replace(/\s+/g, '_')}.pdf`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-900/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative glass rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-white/10 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-brown-100/30 hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Success icon */}
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-full h-full rounded-3xl bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-2xl shadow-gold-500/20"
                            >
                                <CheckCircle className="w-12 h-12 text-dark-900" strokeWidth={2.5} />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 rounded-3xl bg-gold-400 blur-2xl -z-10"
                            />
                        </div>

                        <h3 className="font-heading text-3xl font-bold text-white mb-4 tracking-tight">
                            Registration <span className="text-gold-400 italic">Confirmed</span>
                        </h3>

                        <p className="text-brown-100/60 mb-8 leading-relaxed">
                            Thank you, <span className="text-gold-400 font-bold">{userData?.fullName}</span>. Your application for the Begena training program is now being processed.
                        </p>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownloadPDF}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-gold-500/30 text-gold-400 hover:bg-gold-500/5 transition-all font-bold text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Download PDF Receipt
                                <Download className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="btn-primary w-full py-4 text-sm"
                            >
                                Return to Home
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
