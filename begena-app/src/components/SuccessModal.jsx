import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SuccessModal = ({ isOpen, onClose, userData }) => {
    if (!isOpen) return null;

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
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content glass-strong rounded-3xl p-10 max-w-md w-full mx-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Success icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h3 className="font-heading text-2xl font-bold text-gold-400 mb-3">
                    Registration Successful!
                </h3>
                <p className="text-brown-200 mb-2">
                    Thank you, <span className="text-gold-400 font-semibold">{userData?.fullName}</span>!
                </p>
                <p className="text-brown-300 text-sm mb-8 leading-relaxed">
                    Your registration has been received and saved securely in our system. We will contact you shortly with further details about the Begena training program.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gold-500/50 text-gold-400 hover:bg-gold-500/10 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF Receipt
                    </button>

                    <button
                        onClick={onClose}
                        className="glow-btn w-full"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
