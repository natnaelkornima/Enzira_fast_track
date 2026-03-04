import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Send, Upload, CheckCircle, AlertCircle, Loader2, Globe, Sparkles, ArrowRight, ChevronDown, Search } from 'lucide-react';
import SuccessModal from './SuccessModal';
import { supabase } from '../lib/supabase';

const countryCodes = [
    { code: '+251', country: 'Ethiopia', iso: 'et' },
    { code: '+1', country: 'USA', iso: 'us' },
    { code: '+44', country: 'UK', iso: 'gb' },
    { code: '+49', country: 'Germany', iso: 'de' },
    { code: '+971', country: 'UAE', iso: 'ae' },
    { code: '+966', country: 'Saudi Arabia', iso: 'sa' },
    { code: '+27', country: 'South Africa', iso: 'za' },
    { code: '+254', country: 'Kenya', iso: 'ke' },
    { code: '+39', country: 'Italy', iso: 'it' },
    { code: '+46', country: 'Sweden', iso: 'se' },
    { code: '+47', country: 'Norway', iso: 'no' },
    { code: '+61', country: 'Australia', iso: 'au' },
    { code: '+1', country: 'Canada', iso: 'ca' },
    { code: '+33', country: 'France', iso: 'fr' },
    { code: '+31', country: 'Netherlands', iso: 'nl' },
    { code: '+41', country: 'Switzerland', iso: 'ch' },
    { code: '+32', country: 'Belgium', iso: 'be' },
    { code: '+34', country: 'Spain', iso: 'es' },
    { code: '+91', country: 'India', iso: 'in' },
    { code: '+81', country: 'Japan', iso: 'jp' },
    { code: '+82', country: 'South Korea', iso: 'kr' },
    { code: '+86', country: 'China', iso: 'cn' },
    { code: '+55', country: 'Brazil', iso: 'br' },
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
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const countryPickerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryPickerRef.current && !countryPickerRef.current.contains(event.target)) {
                setIsCountryPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countryCodes.filter(c =>
        c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery)
    );

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0];

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

        setErrors({});
        setStatus('loading');

        try {
            // 1. Upload photo to Supabase Storage
            const fileExt = formData.photo.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, formData.photo)

            if (uploadError) {
                throw new Error('Failed to upload screenshot. Please try again.');
            }

            const { data: publicUrlData } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName)

            // 2. Insert into Supabase Database
            const { error: dbError } = await supabase
                .from('registrations')
                .insert([
                    {
                        full_name: formData.fullName,
                        country_code: formData.countryCode,
                        phone_number: formData.phoneNumber,
                        telegram: formData.telegram,
                        payment_receipt_path: publicUrlData.publicUrl,
                        status: 'pending'
                    }
                ])

            if (dbError) {
                throw new Error('Failed to save registration details. ' + dbError.message);
            }

            setStatus('success');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
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
                                                className="input-modern"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Phone Number */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Phone Number</label>
                                        <div className="grid grid-cols-[100px_1fr] gap-4">
                                            <div className="relative" ref={countryPickerRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                                                    className="w-full h-full bg-dark-900 border border-white/5 rounded-2xl pl-12 pr-4 text-xs text-white appearance-none focus:outline-hidden focus:border-brand-red flex items-center justify-between transition-all"
                                                >
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 flex items-center justify-center rounded-[2px] overflow-hidden">
                                                        <img src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`} srcSet={`https://flagcdn.com/w40/${selectedCountry.iso}.png 2x`} alt={selectedCountry.country} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span>{selectedCountry.code}</span>
                                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isCountryPickerOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isCountryPickerOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                                                        >
                                                            <div className="p-3 border-b border-white/5">
                                                                <div className="relative">
                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Search country..."
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] text-white focus:outline-hidden focus:border-brand-red/50"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                                {filteredCountries.map((c, i) => (
                                                                    <button
                                                                        key={i}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData(prev => ({ ...prev, countryCode: c.code }));
                                                                            setIsCountryPickerOpen(false);
                                                                        }}
                                                                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${formData.countryCode === c.code ? 'bg-brand-red/10' : ''}`}
                                                                    >
                                                                        <div className="w-5 h-3.5 shrink-0 flex items-center justify-center rounded-[2px] overflow-hidden drop-shadow-sm">
                                                                            <img src={`https://flagcdn.com/w20/${c.iso}.png`} srcSet={`https://flagcdn.com/w40/${c.iso}.png 2x`} alt={c.country} className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[10px] font-bold text-white tracking-wide">{c.country}</span>
                                                                            <span className="text-[9px] text-white/30">{c.code}</span>
                                                                        </div>
                                                                        {formData.countryCode === c.code && (
                                                                            <CheckCircle className="w-3 h-3 text-brand-red ml-auto" />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
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
                                                    className="input-modern"
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
                                                className="input-modern"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Photo Upload */}
                                    <motion.div variants={itemVariants} className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Proof of Payment (Screenshot)</label>
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
                                                        <p className="text-white/60 text-xs font-bold">Select Payment Screenshot</p>
                                                        <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">JPG, PNG receipts up to 5MB</p>
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
