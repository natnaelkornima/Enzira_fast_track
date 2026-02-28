import { useState, useEffect, useRef } from 'react';
import SuccessModal from './SuccessModal';

const countryCodes = [
    { code: '+251', country: '🇪🇹 Ethiopia' },
    { code: '+1', country: '🇺🇸 USA' },
    { code: '+44', country: '🇬🇧 UK' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+971', country: '🇦🇪 UAE' },
    { code: '+966', country: '🇸🇦 Saudi Arabia' },
    { code: '+27', country: '🇿🇦 South Africa' },
    { code: '+254', country: '🇰🇪 Kenya' },
    { code: '+39', country: '🇮🇹 Italy' },
    { code: '+46', country: '🇸🇪 Sweden' },
    { code: '+47', country: '🇳🇴 Norway' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+1', country: '🇨🇦 Canada' },
];

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        countryCode: '+251',
        phoneNumber: '',
        telegram: '',
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const sectionRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current?.querySelectorAll('.fade-in-up');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, photo: 'File size must be less than 5MB' }));
                return;
            }
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
            if (errors.photo) {
                setErrors((prev) => ({ ...prev, photo: '' }));
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^\d{6,15}$/.test(formData.phoneNumber.replace(/\s/g, '')))
            newErrors.phoneNumber = 'Enter a valid phone number';
        if (!formData.telegram.trim()) newErrors.telegram = 'Telegram username is required';
        if (!formData.photo) newErrors.photo = 'Please upload your photo';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('countryCode', formData.countryCode);
            formDataToSend.append('phoneNumber', formData.phoneNumber);
            formDataToSend.append('telegram', formData.telegram);
            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }

            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit registration');
            }

            const result = await response.json();

            // Set the complete user data from the backend to pass to the modal
            setFormData(prev => ({ ...prev, serverData: result.user }));
            setShowSuccess(true);
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ submit: error.message || 'Something went wrong. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setFormData({
            fullName: '',
            countryCode: '+251',
            phoneNumber: '',
            telegram: '',
            photo: null,
        });
        setPhotoPreview(null);
    };

    return (
        <>
            <section id="register" ref={sectionRef} className="relative py-24 md:py-32 px-6">
                {/* Background decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-gold-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-brown-600/5 rounded-full blur-3xl" />

                <div className="max-w-2xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12 fade-in-up">
                        <span className="inline-block px-4 py-1.5 glass rounded-full text-gold-400 text-xs font-semibold tracking-widest uppercase mb-5">
                            Enroll Today
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                                Registration Form
                            </span>
                        </h2>
                        <p className="text-brown-300 text-lg font-light">
                            Fill in your details below to join the Begena training program.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="fade-in-up glass-strong rounded-3xl p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-brown-200 mb-2">
                                    Full Name <span className="text-gold-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="input-glow w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-brown-50 placeholder-brown-400/50 transition-all duration-300 text-sm"
                                />
                                {errors.fullName && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-brown-200 mb-2">
                                    Phone Number <span className="text-gold-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="input-glow px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-brown-50 transition-all duration-300 text-sm min-w-[140px] cursor-pointer"
                                    >
                                        {countryCodes.map((c, i) => (
                                            <option key={i} value={c.code} className="bg-dark-800 text-brown-50">
                                                {c.country} ({c.code})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="912 345 678"
                                        className="input-glow flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-brown-50 placeholder-brown-400/50 transition-all duration-300 text-sm"
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Telegram Username */}
                            <div>
                                <label htmlFor="telegram" className="block text-sm font-medium text-brown-200 mb-2">
                                    Telegram Username <span className="text-gold-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/60 text-sm font-medium">@</span>
                                    <input
                                        type="text"
                                        id="telegram"
                                        name="telegram"
                                        value={formData.telegram}
                                        onChange={handleChange}
                                        placeholder="username"
                                        className="input-glow w-full pl-9 pr-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-brown-50 placeholder-brown-400/50 transition-all duration-300 text-sm"
                                    />
                                </div>
                                {errors.telegram && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.telegram}</p>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-brown-200 mb-2">
                                    Upload Your Photo <span className="text-gold-500">*</span>
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="photo-upload-area rounded-xl p-6 text-center cursor-pointer"
                                >
                                    {photoPreview ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gold-500/40"
                                            />
                                            <span className="text-brown-300 text-xs">Click to change photo</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-1">
                                                <svg className="w-6 h-6 text-gold-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <span className="text-brown-300 text-sm">Click to upload your photo</span>
                                            <span className="text-brown-400/60 text-xs">JPG, PNG up to 5MB</span>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </div>
                                {errors.photo && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.photo}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="glow-btn w-full !rounded-xl !py-4 !text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    'Submit Registration'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <SuccessModal
                isOpen={showSuccess}
                onClose={handleCloseSuccess}
                userData={{ ...formData, ...formData.serverData }}
            />
        </>
    );
};

export default RegistrationForm;
