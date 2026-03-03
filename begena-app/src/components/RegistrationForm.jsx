import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Send, Upload, CheckCircle, AlertCircle, Loader2, Globe } from 'lucide-react';
import SuccessModal from './SuccessModal';

const countryCodes = [
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
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
    const fileInputRef = useRef(null);

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

    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="register" className="relative section-container overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-600/5 rounded-full blur-[100px] animate-glow" />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-5 py-1.5 glass rounded-full text-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                        Start Your Mastery
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        <span className="text-white">Join the </span>
                        <span className="italic text-transparent bg-clip-text bg-linear-to-r from-gold-300 to-gold-600">
                            Training Program
                        </span>
                    </h2>
                    <p className="text-brown-100/50 text-lg font-light">
                        Embark on your spiritual and musical journey today.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Full Name */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-brown-100/70 ml-1">
                                <User className="w-4 h-4 text-gold-500/60" />
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="input-modern"
                                />
                                <AnimatePresence>
                                    {errors.fullName && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-6 left-1 flex items-center gap-1.5 text-red-400 text-[11px] font-medium"
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.fullName}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-brown-100/70 ml-1">
                                <Phone className="w-4 h-4 text-gold-500/60" />
                                Phone Number
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative group sm:w-48">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/40 group-focus-within:text-gold-400 transition-colors" />
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="input-modern pl-11 pr-4 appearance-none cursor-pointer"
                                    >
                                        {countryCodes.map((c, i) => (
                                            <option key={i} value={c.code} className="bg-dark-900 text-brown-50">
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="912 345 678"
                                        className="input-modern"
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {errors.phoneNumber && (
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-red-400 text-[11px] font-medium ml-1"
                                    >
                                        {errors.phoneNumber}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Telegram Username */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-brown-100/70 ml-1">
                                <Send className="w-4 h-4 text-gold-500/60" />
                                Telegram Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 font-bold">@</span>
                                <input
                                    type="text"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                    placeholder="username"
                                    className="input-modern pl-10!"
                                />
                                <AnimatePresence>
                                    {errors.telegram && (
                                        <motion.p
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="absolute -bottom-6 left-1 text-red-400 text-[11px] font-medium"
                                        >
                                            {errors.telegram}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-brown-100/70 ml-1">
                                <Upload className="w-4 h-4 text-gold-500/60" />
                                Profile Photo
                            </label>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative rounded-3xl p-8 border-2 border-dashed transition-all duration-300 group cursor-pointer text-center ${photoPreview ? 'border-gold-500/40 bg-gold-500/5' : 'border-white/10 hover:border-gold-500/30 bg-white/5'
                                    }`}
                            >
                                {photoPreview ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-24 h-24 rounded-2xl object-cover border-2 border-gold-500/50 shadow-2xl"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-gold-500 rounded-full p-1 shadow-lg">
                                                <CheckCircle className="w-4 h-4 text-dark-900" />
                                            </div>
                                        </div>
                                        <span className="text-gold-400 text-xs font-bold uppercase tracking-wider">Change Photo</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition-all duration-500">
                                            <Upload className="w-6 h-6 text-gold-500/40 group-hover:text-gold-400 transition-colors" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-brown-100 font-semibold">Drop your photo here</p>
                                            <p className="text-brown-100/40 text-xs">JPG or PNG (max 5MB)</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </motion.div>
                            <AnimatePresence>
                                {errors.photo && (
                                    <p className="text-red-400 text-[11px] font-medium ml-1">{errors.photo}</p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full py-4.5 text-lg disabled:opacity-70 disabled:grayscale transition-all"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Registering...</span>
                                    </div>
                                ) : (
                                    'Complete Registration'
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>

            <SuccessModal
                isOpen={showSuccess}
                onClose={handleCloseSuccess}
                userData={{ ...formData, ...formData.serverData }}
            />
        </section>
    );
};

export default RegistrationForm;
