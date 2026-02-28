const SuccessModal = ({ isOpen, onClose, name }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content glass-strong rounded-3xl p-10 max-w-md mx-6 text-center"
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
                    Thank you, <span className="text-gold-400 font-semibold">{name}</span>!
                </p>
                <p className="text-brown-300 text-sm mb-8 leading-relaxed">
                    Your registration has been received. We will contact you shortly with further details about the Begena training program.
                </p>

                <button
                    onClick={onClose}
                    className="glow-btn w-full"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
