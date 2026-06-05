import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Send, Upload, CheckCircle, AlertCircle, Loader2, Globe, Sparkles, ArrowRight, ChevronDown, Search } from 'lucide-react';
import SuccessModal from './SuccessModal';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../lib/LanguageContext';
import telebirrLogo from '../assets/telebirr-logo.png';
import cbeLogo from '../assets/cbe-logo.png';

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

const CBELogo = () => (
    <div className="flex items-center justify-center w-28 h-12 rounded-lg bg-white border border-white/20 shadow-sm shrink-0 overflow-hidden">
        <img src={cbeLogo} alt="Commercial Bank of Ethiopia" className="w-full h-full object-contain" />
    </div>
);

const TelebirrLogo = () => (
    <div className="flex items-center justify-center w-28 h-12 rounded-lg bg-white border border-white/20 shadow-sm shrink-0 overflow-hidden p-1">
        <img src={telebirrLogo} alt="Telebirr" className="w-full h-full object-contain" />
    </div>
);

const PaymentCard = ({ name, accountNumber, logo: Logo, color }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass p-5 flex items-center justify-between border border-white/5 hover:border-brand-red/20 transition-all duration-300 relative overflow-hidden rounded-lg">
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}/5 rounded-full blur-2xl pointer-events-none transition-colors duration-500`} />
            
            <div className="flex items-center gap-5 relative z-10 mr-4">
                <Logo />
                <div>
                    <h4 className="text-white font-bold text-[10px] md:text-xs tracking-wide uppercase text-white/50">{name}</h4>
                    <p className="text-white font-mono font-black text-base md:text-lg lg:text-xl mt-1 tracking-wider">{accountNumber}</p>
                    <p className="text-brand-red font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-1">Kirubel Habtamu Enyew</p>
                </div>
            </div>
            
            <button
                type="button"
                onClick={handleCopy}
                className="relative z-10 flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 hover:bg-brand-red text-white/50 hover:text-white border border-white/10 hover:border-brand-red transition-all cursor-pointer group/btn select-none shrink-0"
                title="Copy to clipboard"
            >
                {copied ? (
                    <span className="text-[10px] font-bold text-green-400 group-hover/btn:text-white uppercase tracking-widest">Copied</span>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover/btn:text-white">Copy</span>
                )}
            </button>
        </div>
    );
};

const RegistrationForm = () => {
    const { t } = useLanguage();
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
    const [step, setStep] = useState(1);
    const [isEthiopia, setIsEthiopia] = useState(true);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const countryPickerRef = useRef(null);

    // Fetch user's IP-based location to set fee structure
    useEffect(() => {
        const detectLocation = async () => {
            setLoadingLocation(true);
            try {
                let countryCode = '';
                // Attempt freeipapi.com
                const response = await fetch('https://freeipapi.com/api/json');
                if (response.ok) {
                    const data = await response.json();
                    countryCode = data.countryCode;
                } else {
                    // Fallback to ipapi.co
                    const response2 = await fetch('https://ipapi.co/json/');
                    if (response2.ok) {
                        const data2 = await response2.json();
                        countryCode = data2.country;
                    }
                }
                
                if (countryCode) {
                    const isEt = countryCode.toUpperCase() === 'ET';
                    setIsEthiopia(isEt);
                    
                    // Match and pre-select phone code dropdown if matching
                    const matchedCountry = countryCodes.find(c => c.iso.toUpperCase() === countryCode.toUpperCase());
                    if (matchedCountry) {
                        setFormData(prev => ({
                            ...prev,
                            countryCode: matchedCountry.code
                        }));
                    }
                }
            } catch (error) {
                console.error('Error detecting location:', error);
            } finally {
                setLoadingLocation(false);
            }
        };

        detectLocation();
    }, []);

    // Keep pricing dynamically in sync with the selected country code in phone field
    useEffect(() => {
        if (formData.countryCode === '+251') {
            setIsEthiopia(true);
        } else {
            setIsEthiopia(false);
        }
    }, [formData.countryCode]);

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
                setErrors((prev) => ({ ...prev, photo: t('registration.validation.fileSize') }));
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

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = t('registration.validation.fullName');
        
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('registration.validation.phoneNumber');
        } else {
            const cleanPhone = formData.phoneNumber.replace(/\s/g, '');
            if (!/^\d{6,15}$/.test(cleanPhone)) {
                newErrors.phoneNumber = t('registration.validation.validPhone');
            }
        }
        
        if (!formData.telegram.trim()) newErrors.telegram = t('registration.validation.telegram');
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.photo) newErrors.photo = t('registration.validation.photo');
        return newErrors;
    };

    const handleProceedToPayment = () => {
        const step1Errors = validateStep1();
        if (Object.keys(step1Errors).length > 0) {
            setErrors(step1Errors);
            return;
        }
        setErrors({});
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const step1Errors = validateStep1();
        const step2Errors = validateStep2();
        const allErrors = { ...step1Errors, ...step2Errors };
        
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            if (Object.keys(step1Errors).length > 0) {
                setStep(1);
            }
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
                .upload(fileName, formData.photo, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: formData.photo.type
                })

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error(uploadError.message || 'Failed to upload screenshot. Please try again.');
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

    return (
        <section id="register" className="section-container relative bg-dark-950 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left Side: Dynamic Left Panel based on step */}
                    <div className="lg:sticky lg:top-32 min-h-[350px] flex flex-col justify-start">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="left-step1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {t('nav.enrollNow')}
                                        </div>
                                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                            {t('hero.headingLine1')} <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-white italic">{t('hero.headingLine2')}</span>
                                        </h2>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                                            {t('hero.description')}
                                        </p>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                        <div>
                                            <h4 className="text-2xl font-black text-white">{t('hero.stat1Value')}</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{t('hero.stat1Label')}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-white">{t('hero.stat2Value')}</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{t('hero.stat2Label')}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-white">{t('hero.stat3Value')}</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{t('hero.stat3Label')}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="left-step2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold tracking-widest uppercase mb-6">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {t('registration.sectionSubtitle')}
                                        </div>
                                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                            {t('registration.pathTitle1')} <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-red to-white italic">{t('registration.pathTitle2')}</span>
                                        </h2>
                                        <p className="text-white/40 text-sm leading-relaxed max-w-lg">
                                            {t('registration.pathDesc')}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <PaymentCard 
                                            name="Commercial Bank of Ethiopia (CBE)" 
                                            accountNumber="1000432170393" 
                                            logo={CBELogo} 
                                            color="yellow-500"
                                        />
                                        <PaymentCard 
                                            name="Telebirr" 
                                            accountNumber="0920312156" 
                                            logo={TelebirrLogo} 
                                            color="blue-500"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Step-Based Form */}
                    <div className="relative">
                        <div className="glass rounded-2xl p-8 md:p-12 border-white/5 relative overflow-hidden">
                            {/* Form Header */}
                            <div className="mb-8 flex flex-col">
                                <h3 className="text-2xl font-bold text-white mb-2">{t('registration.formTitle')}</h3>
                                <p className="text-white/30 text-sm">{t('registration.formDesc')}</p>
                            </div>

                            {/* Custom Wizard Progress Tracker */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${step === 1 ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(152,28,0,0.5)]' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                        {step > 1 ? "✓" : "1"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Step 1</span>
                                        <span className={`text-[11px] font-bold ${step === 1 ? 'text-white' : 'text-white/50'}`}>{t('registration.step1')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 h-[2px] mx-4 bg-white/5 relative overflow-hidden">
                                    <div className={`absolute inset-y-0 left-0 bg-brand-red transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${step === 2 ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(152,28,0,0.5)]' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                                        2
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Step 2</span>
                                        <span className={`text-[11px] font-bold ${step === 2 ? 'text-white' : 'text-white/30'}`}>{t('registration.step2')}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1-fields"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {/* Full Name */}
                                            <div className="space-y-2">
                                                <label className="text-sm uppercase font-bold tracking-widest text-white/90 ml-4">{t('registration.fullName')}</label>
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder={t('registration.fullNamePlaceholder')}
                                                        className={`input-modern ${errors.fullName ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}`}
                                                    />
                                                </div>
                                                {errors.fullName && (
                                                    <span className="text-xs text-red-500 font-semibold mt-1 ml-4 block">{errors.fullName}</span>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                            <div className="space-y-2">
                                                <label className="text-sm uppercase font-bold tracking-widest text-white/90 ml-4">{t('registration.phoneNumber')}</label>
                                                <div className="grid grid-cols-[100px_1fr] gap-4">
                                                    <div className="relative" ref={countryPickerRef}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                                                            className="w-full h-full bg-dark-900 border border-white/20 rounded-2xl pl-12 pr-4 text-xs text-white appearance-none focus:outline-hidden focus:border-brand-red flex items-center justify-between transition-all"
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
                                                            type="tel"
                                                            name="phoneNumber"
                                                            value={formData.phoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="911 22 33 44"
                                                            className={`input-modern ${errors.phoneNumber ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                                {errors.phoneNumber && (
                                                    <span className="text-xs text-red-500 font-semibold mt-1 ml-4 block">{errors.phoneNumber}</span>
                                                )}
                                            </div>

                                            {/* Telegram */}
                                            <div className="space-y-2">
                                                <label className="text-sm uppercase font-bold tracking-widest text-white/90 ml-4">{t('registration.telegram')}</label>
                                                <div className="relative group">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                                        <Send className="w-5 h-5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="telegram"
                                                        value={formData.telegram}
                                                        onChange={handleChange}
                                                        placeholder="@username"
                                                        className={`input-modern ${errors.telegram ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : ''}`}
                                                    />
                                                </div>
                                                {errors.telegram && (
                                                    <span className="text-xs text-red-500 font-semibold mt-1 ml-4 block">{errors.telegram}</span>
                                                )}
                                            </div>

                                            {/* Proceed to Payment Button */}
                                            <div className="pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleProceedToPayment}
                                                    className="btn-primary w-full py-5 group relative overflow-hidden cursor-pointer"
                                                >
                                                    <div className="flex items-center justify-center gap-3 relative z-10">
                                                        <span>{t('registration.proceedToPayment')}</span>
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite]" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2-fields"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {/* Premium Location-Based Price Badge */}
                                            <div className="glass border border-brand-red/20 rounded-2xl p-6 bg-gradient-to-br from-brand-red/10 to-transparent relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Sparkles className="w-16 h-16 text-brand-red animate-pulse" />
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest text-brand-red font-extrabold">{t('registration.amountToPay')}</span>
                                                <div className="flex items-baseline gap-2 mt-2">
                                                    {loadingLocation ? (
                                                        <div className="flex items-center gap-2 text-white/50 text-sm py-2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
                                                            <span>{t('registration.detectingLocation')}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                                                {isEthiopia ? "2,500" : "50"}
                                                            </span>
                                                            <span className="text-lg font-bold text-white/70">
                                                                {isEthiopia ? "Birr" : "USD"}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-white/40 text-xs mt-2 leading-relaxed">
                                                    {isEthiopia 
                                                        ? "Special pricing applied for participants within Ethiopia." 
                                                        : "Standard pricing applied for international participants."}
                                                </p>
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="space-y-2">
                                                <label className="text-sm uppercase font-bold tracking-widest text-white/90 ml-4">{t('registration.proofOfPayment')}</label>
                                                <label className={`block border-2 border-dashed rounded-2xl p-8 text-center hover:bg-white/5 transition-all cursor-pointer group ${errors.photo ? 'border-red-500/50 bg-red-500/5' : 'border-white/20 hover:border-brand-red/30'}`}>
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
                                                                <p className="text-white/60 text-xs font-bold">{t('registration.uploadText')}</p>
                                                                <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">{t('registration.uploadHint')}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                                {errors.photo && (
                                                    <span className="text-xs text-red-500 font-semibold mt-1 ml-4 block">{errors.photo}</span>
                                                )}
                                            </div>

                                            {/* Submit & Back Buttons */}
                                            <div className="pt-4 space-y-4">
                                                <button
                                                    type="submit"
                                                    disabled={status === 'loading'}
                                                    className="btn-primary w-full py-5 group relative overflow-hidden cursor-pointer"
                                                >
                                                    {status === 'loading' ? (
                                                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <span>{t('registration.submitButton')}</span>
                                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite]" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex items-center justify-center gap-2 mx-auto text-xs uppercase tracking-widest text-white/40 hover:text-white font-bold transition-colors py-2 group cursor-pointer"
                                                >
                                                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                                    <span>{t('registration.backToDetails')}</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                    </div>
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
