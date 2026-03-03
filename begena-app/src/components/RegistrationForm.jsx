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
        setStatus('loading');

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStatus('success');
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section id="register" className="section-container relative bg-dark-950 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left Side: Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:sticky lg:top-32"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            Admission Open
                        </div>
                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                            Begin Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-white italic">Spiritual Path</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-lg">
                            Join a community of dedicated practitioners and learn the sacred art of Begena. Secure your spot in our next training cycle.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: 'Authentic Curriculum', desc: 'Direct from traditional masters.' },
                                { title: 'Flexible Schedule', desc: 'Classes that fit your spiritual life.' },
                                { title: 'Global Community', desc: 'Learn with students from around the world.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-brand-red/20 flex items-center justify-center mt-1">
                                        <div className="w-2 h-2 rounded-full bg-brand-red" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-wide">{item.title}</h4>
                                        <p className="text-white/30 text-xs mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="glass rounded-4xl p-8 md:p-12 border-white/5 relative overflow-hidden">
                            {/* Form Header */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-white mb-2">Registration Form</h3>
                                <p className="text-white/30 text-sm">Please fill in your details accurately.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                    {/* Full Name */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="input-modern pl-14"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Phone Number */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Phone Number</label>
                                        <div className="grid grid-cols-[100px_1fr] gap-4">
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                                    <Globe className="w-3.5 h-3.5" />
                                                </div>
                                                <select
                                                    name="countryCode"
                                                    value={formData.countryCode}
                                                    onChange={handleChange}
                                                    className="w-full h-full bg-dark-900 border border-white/5 rounded-2xl pl-10 pr-4 text-xs text-white appearance-none focus:outline-hidden focus:border-brand-red/50"
                                                >
                                                    <option value="+251">+251</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                </select>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    placeholder="911 22 33 44"
                                                    className="input-modern pl-14"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Telegram */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Telegram Username</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                                <Send className="w-5 h-5" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                name="telegram"
                                                value={formData.telegram}
                                                onChange={handleChange}
                                                placeholder="@username"
                                                className="input-modern pl-14"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Photo Upload */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Student Identification Photo</label>
                                        <label className="block border-2 border-dashed border-white/5 rounded-4xl p-8 text-center hover:bg-white/5 hover:border-brand-red/30 transition-all cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoChange}
                                            />
                                            {photoPreview ? (
                                                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-brand-red group-hover:scale-110 transition-transform">
                                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all">
                                                        <Upload className="w-6 h-6 text-white/20 group-hover:text-inherit" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white/60 text-xs font-bold">Select Photo</p>
                                                        <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </motion.div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="btn-primary w-full py-5 group relative overflow-hidden"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <span>Confirm Registration</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                        {/* Animated sweep effect */}
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite]" />
                                    </button>
                                </motion.div>
                            </form>
                        </div>

                        {/* Status Feedback */}
                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    {errorMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={status === 'success'}
                onClose={() => setStatus('idle')}
                userData={formData}
            />
        </section>
    );
};

export default RegistrationForm;
