import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Send, Upload, CheckCircle, AlertCircle, Loader2, Globe, Sparkles, ArrowRight, ChevronDown, Search } from 'lucide-react';
import SuccessModal from './SuccessModal';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { compressImage } from '../lib/imageUtils';
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

const PaymentCard = ({ name, accountNumber, logo, color }) => {
    const [copied, setCopied] = useState(false);
    const LogoComponent = logo;

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass p-5 flex items-center justify-between border border-white/5 hover:border-brand-red/20 transition-all duration-300 relative overflow-hidden rounded-lg">
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}/5 rounded-full blur-2xl pointer-events-none transition-colors duration-500`} />
            
            <div className="flex items-center gap-5 relative z-10 mr-4">
                <LogoComponent />
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
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isEthiopia = formData.countryCode === '+251';

    const countryPickerRef = useRef(null);

    // Fetch user's IP-based location to set fee structure (with safe timeouts & timezone fallback)
    useEffect(() => {
        let isMounted = true;

        const detectLocation = async () => {
            setLoadingLocation(true);
            let countryCode = '';

            const fetchWithTimeout = async (url, timeoutMs = 2500) => {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), timeoutMs);
                try {
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(timer);
                    if (res.ok) {
                        return await res.json();
                    }
                } catch {
                    clearTimeout(timer);
                }
                return null;
            };

            try {
                // Attempt freeipapi.com
                const data1 = await fetchWithTimeout('https://freeipapi.com/api/json');
                if (data1?.countryCode) {
                    countryCode = data1.countryCode;
                }

                // If not found, fallback to ipapi.co
                if (!countryCode) {
                    const data2 = await fetchWithTimeout('https://ipapi.co/json/');
                    if (data2?.country) {
                        countryCode = data2.country;
                    }
                }

                // If network geolocation failed (e.g. adblocker, iframe CORS, or rate limits), fallback to browser timezone
                if (!countryCode) {
                    try {
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
                        if (tz.includes('Addis_Ababa') || tz.includes('Nairobi') || tz.includes('Asmara')) {
                            countryCode = 'ET';
                        } else if (tz.startsWith('America/')) {
                            countryCode = 'US';
                        } else if (tz.startsWith('Europe/London')) {
                            countryCode = 'GB';
                        } else if (tz.startsWith('Europe/Berlin') || tz.startsWith('Europe/Frankfurt')) {
                            countryCode = 'DE';
                        } else if (tz.startsWith('Europe/Paris')) {
                            countryCode = 'FR';
                        } else if (tz.startsWith('Europe/Stockholm')) {
                            countryCode = 'SE';
                        } else if (tz.startsWith('Europe/Rome')) {
                            countryCode = 'IT';
                        } else if (tz.startsWith('Asia/Dubai')) {
                            countryCode = 'AE';
                        } else if (tz.startsWith('Asia/Riyadh')) {
                            countryCode = 'SA';
                        } else if (tz.startsWith('Australia/')) {
                            countryCode = 'AU';
                        } else if (tz.startsWith('Asia/Kolkata')) {
                            countryCode = 'IN';
                        }
                    } catch {
                        // ignore timezone detection failure
                    }
                }

                if (isMounted && countryCode) {
                    const matchedCountry = countryCodes.find(c => c.iso.toUpperCase() === countryCode.toUpperCase());
                    if (matchedCountry) {
                        setFormData(prev => ({
                            ...prev,
                            countryCode: matchedCountry.code
                        }));
                    }
                }
            } catch {
                // Silently fallback to default (+251 Ethiopia)
            } finally {
                if (isMounted) {
                    setLoadingLocation(false);
                }
            }
        };

        detectLocation();

        return () => {
            isMounted = false;
        };
    }, []);

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

    const processSelectedFile = (file) => {
        if (!file) return;

        if (!file.type || !file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, photo: 'Please select a valid image file (PNG, JPG, JPEG, WEBP).' }));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
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
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        processSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer?.files?.[0]) {
            processSelectedFile(e.dataTransfer.files[0]);
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

        if (!formData.photo) {
            setErrors({ photo: t('registration.validation.photo') });
            return;
        }

        setErrors({});
        setStatus('loading');

        try {
            // 1. Process & optimize screenshot (reduces network load, prevents timeouts)
            let uploadBlob = formData.photo;
            let fallbackDataUrl = photoPreview || '';

            try {
                const optimized = await compressImage(formData.photo);
                if (optimized.blob) {
                    uploadBlob = optimized.blob;
                }
                if (optimized.dataUrl) {
                    fallbackDataUrl = optimized.dataUrl;
                }
            } catch (optError) {
                console.warn('Image optimization notice (continuing with original):', optError);
            }

            let receiptFinalPath = '';

            // 2. Try Supabase Storage upload if credentials are present
            if (isSupabaseConfigured()) {
                try {
                    const rawExt = formData.photo.name?.split('.').pop() || 'jpg';
                    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
                    const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                    const contentType = uploadBlob.type || `image/${fileExt === 'png' ? 'png' : 'jpeg'}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('receipts')
                        .upload(fileName, uploadBlob, {
                            cacheControl: '3600',
                            upsert: true,
                            contentType
                        });

                    if (!uploadError && uploadData) {
                        const { data: publicUrlData } = supabase.storage
                            .from('receipts')
                            .getPublicUrl(fileName);

                        if (publicUrlData?.publicUrl) {
                            receiptFinalPath = publicUrlData.publicUrl;
                        }
                    } else if (uploadError) {
                        console.warn('Supabase storage upload notice, falling back to embedded receipt data:', uploadError);
                    }
                } catch (storageException) {
                    console.warn('Supabase storage exception, falling back to embedded receipt data:', storageException);
                }
            }

            // Fallback: If storage bucket upload didn't succeed (e.g., bucket not created or storage RLS policy missing),
            // safely store the compressed image data URI in the database so the student registration is never lost!
            if (!receiptFinalPath) {
                receiptFinalPath = fallbackDataUrl || photoPreview;
            }

            if (!receiptFinalPath) {
                throw new Error('Could not process payment screenshot. Please choose an image file and try again.');
            }

            // 3. Insert record into Supabase database
            // Adaptive payload: supports name, phone_number, username, uploaded_screenshot as requested,
            // while maintaining full compatibility with legacy schemas.
            const fullPhone = `${formData.countryCode} ${formData.phoneNumber}`.trim();
            const candidatePayloads = [
                // Option A: Unified payload (populates both requested and legacy columns)
                {
                    name: formData.fullName,
                    full_name: formData.fullName,
                    phone_number: formData.phoneNumber,
                    country_code: formData.countryCode,
                    username: formData.telegram,
                    telegram: formData.telegram,
                    uploaded_screenshot: receiptFinalPath,
                    payment_receipt_path: receiptFinalPath,
                    status: 'pending'
                },
                // Option B: Specifically user's requested 4 fields (name, phone_number, username, uploaded_screenshot) + status
                {
                    name: formData.fullName,
                    phone_number: fullPhone,
                    username: formData.telegram,
                    uploaded_screenshot: receiptFinalPath,
                    status: 'pending'
                },
                // Option C: Specifically user's requested 4 fields without status
                {
                    name: formData.fullName,
                    phone_number: fullPhone,
                    username: formData.telegram,
                    uploaded_screenshot: receiptFinalPath
                },
                // Option D: Legacy column naming
                {
                    full_name: formData.fullName,
                    country_code: formData.countryCode,
                    phone_number: formData.phoneNumber,
                    telegram: formData.telegram,
                    payment_receipt_path: receiptFinalPath,
                    status: 'pending'
                }
            ];

            let insertSuccess = false;
            let lastDbError = null;

            for (const payload of candidatePayloads) {
                const { error: dbError } = await supabase
                    .from('registrations')
                    .insert([payload]);

                if (!dbError) {
                    insertSuccess = true;
                    break;
                } else {
                    lastDbError = dbError;
                    // If error is about a missing column, try next candidate payload
                    if (dbError.message && dbError.message.includes('column') && dbError.message.includes('does not exist')) {
                        continue;
                    }
                    // For RLS permission or network errors, do not retry blindly
                    break;
                }
            }

            if (!insertSuccess && lastDbError) {
                console.error('Database insert error:', lastDbError);
                if (lastDbError.message && lastDbError.message.includes('violates row-level security')) {
                    throw new Error('Database permission error. Please run the supabase_setup.sql script in your Supabase SQL editor to enable public registration submissions.');
                }
                throw new Error(lastDbError.message || 'Failed to save registration details. Please try again.');
            }

            setStatus('success');
        } catch (error) {
            console.error('Registration submission error:', error);
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
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase mb-6">
                                            {t('nav.enrollNow')}
                                        </div>
                                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight font-balderasu">
                                            {t('hero.headingLine1')} <br />
                                            <span className="text-white">{t('hero.headingLine2')}</span>
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
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest uppercase mb-6">
                                            {t('registration.sectionSubtitle')}
                                        </div>
                                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight font-balderasu">
                                            {t('registration.pathTitle1')} <br />
                                            <span className="text-white">{t('registration.pathTitle2')}</span>
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
                        <div className="registration-card-premium">
                            {/* Form Header */}
                            <div className="mb-6 flex flex-col">
                                <h3 className="text-lg font-bold text-white tracking-wide">{t('registration.formTitle')}</h3>
                                <p className="text-white/40 text-[11px] mt-1">{t('registration.formDesc')}</p>
                            </div>

                            {/* Custom Premium Progress Tracker */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold text-white/40">
                                    <span>{step === 1 ? t('registration.step1') : t('registration.step2')}</span>
                                    <span>{step} / 2</span>
                                </div>
                                <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-red transition-all duration-500 ease-out" style={{ width: step === 1 ? '50%' : '100%' }} />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1-fields"
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 15 }}
                                            transition={{ duration: 0.25 }}
                                            className="space-y-5"
                                        >
                                            {/* Full Name */}
                                            <div className="flex flex-col gap-2">
                                                <label className="label-premium">{t('registration.fullName')}</label>
                                                <div className="relative group">
                                                    <div className="input-icon-wrapper-premium">
                                                        <User className="w-4.5 h-4.5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder={t('registration.fullNamePlaceholder')}
                                                        className={`input-premium ${errors.fullName ? 'border-red-500/30 bg-red-500/[0.01]' : ''}`}
                                                    />
                                                </div>
                                                {errors.fullName && (
                                                    <span className="text-[10px] text-red-500 font-semibold mt-1 ml-1 block">{errors.fullName}</span>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                            <div className="flex flex-col gap-2">
                                                <label className="label-premium">{t('registration.phoneNumber')}</label>
                                                <div className="grid grid-cols-[90px_1fr] gap-3">
                                                    <div className="relative" ref={countryPickerRef}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                                                            className="country-trigger-premium"
                                                        >
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-3 flex items-center justify-center rounded-[1px] overflow-hidden shadow-xs">
                                                                <img src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`} srcSet={`https://flagcdn.com/w40/${selectedCountry.iso}.png 2x`} alt={selectedCountry.country} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-xs font-semibold">{selectedCountry.code}</span>
                                                            <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${isCountryPickerOpen ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        <AnimatePresence>
                                                            {isCountryPickerOpen && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    className="dropdown-premium"
                                                                >
                                                                    <div className="p-2 border-b border-white/5">
                                                                        <div className="relative">
                                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Search country..."
                                                                                value={searchQuery}
                                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                                className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-white focus:outline-hidden focus:border-brand-red/50"
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
                                                                                className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${formData.countryCode === c.code ? 'bg-brand-red/10' : ''}`}
                                                                            >
                                                                                <div className="w-4.5 h-3 shrink-0 flex items-center justify-center rounded-[2px] overflow-hidden drop-shadow-sm">
                                                                                    <img src={`https://flagcdn.com/w20/${c.iso}.png`} srcSet={`https://flagcdn.com/w40/${c.iso}.png 2x`} alt={c.country} className="w-full h-full object-cover" />
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[10px] font-bold text-white tracking-wide">{c.country}</span>
                                                                                    <span className="text-[9px] text-white/30">{c.code}</span>
                                                                                </div>
                                                                                {formData.countryCode === c.code && (
                                                                                    <CheckCircle className="w-3.5 h-3.5 text-brand-red ml-auto" />
                                                                                )}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <div className="relative group col-span-1">
                                                        <div className="input-icon-wrapper-premium">
                                                            <Phone className="w-4.5 h-4.5" />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="phoneNumber"
                                                            value={formData.phoneNumber}
                                                            onChange={handleChange}
                                                            placeholder="911 22 33 44"
                                                            className={`input-premium ${errors.phoneNumber ? 'border-red-500/30 bg-red-500/[0.01]' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                                {errors.phoneNumber && (
                                                    <span className="text-[10px] text-red-500 font-semibold mt-1 ml-1 block">{errors.phoneNumber}</span>
                                                )}
                                            </div>

                                            {/* Telegram */}
                                            <div className="flex flex-col gap-2">
                                                <label className="label-premium">{t('registration.telegram')}</label>
                                                <div className="relative group">
                                                    <div className="input-icon-wrapper-premium">
                                                        <Send className="w-4.5 h-4.5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="telegram"
                                                        value={formData.telegram}
                                                        onChange={handleChange}
                                                        placeholder="@username"
                                                        className={`input-premium ${errors.telegram ? 'border-red-500/30 bg-red-500/[0.01]' : ''}`}
                                                    />
                                                </div>
                                                {errors.telegram && (
                                                    <span className="text-[10px] text-red-500 font-semibold mt-1 ml-1 block">{errors.telegram}</span>
                                                )}
                                            </div>

                                            {/* Proceed to Payment Button */}
                                            <div className="pt-2">
                                                <button
                                                    type="button"
                                                    onClick={handleProceedToPayment}
                                                    className="btn-premium-action group"
                                                >
                                                    <span>{t('registration.proceedToPayment')}</span>
                                                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2-fields"
                                            initial={{ opacity: 0, x: 15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -15 }}
                                            transition={{ duration: 0.25 }}
                                            className="space-y-5"
                                        >
                                            {/* Premium Location-Based Price Badge */}
                                            <div className="price-card-premium">
                                                <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold block">{t('registration.amountToPay')}</span>
                                                <div className="flex items-baseline gap-1.5 mt-2">
                                                    {loadingLocation ? (
                                                        <div className="flex items-center gap-2 text-white/40 text-xs py-1">
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-red" />
                                                            <span>{t('registration.detectingLocation')}</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="text-3xl font-black text-white tracking-tight">
                                                                {isEthiopia ? "2,500" : "50"}
                                                            </span>
                                                            <span className="text-sm font-bold text-white/60">
                                                                {isEthiopia ? "Birr" : "USD"}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-white/30 text-[10px] mt-1.5 leading-relaxed">
                                                    {isEthiopia 
                                                        ? "Special pricing applied for participants within Ethiopia." 
                                                        : "Standard pricing applied for international participants."}
                                                </p>
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="flex flex-col gap-2">
                                                <label className="label-premium">{t('registration.proofOfPayment')}</label>
                                                <label
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    className={`upload-zone-premium cursor-pointer transition-all duration-200 ${errors.photo ? 'has-error' : ''} ${isDragging ? 'ring-2 ring-brand-red bg-brand-red/10' : ''}`}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onClick={(e) => { e.target.value = null; }}
                                                        onChange={handlePhotoChange}
                                                    />
                                                    {photoPreview ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden border border-brand-red/50 hover:scale-105 transition-transform duration-300 shadow-lg">
                                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider hover:underline">
                                                                Click to change image
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2.5">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                                                                <Upload className="w-5 h-5 text-white/30 group-hover:text-inherit" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white/60 text-xs font-bold">{t('registration.uploadText')}</p>
                                                                <p className="text-white/20 text-[9px] mt-0.5 uppercase tracking-widest">{t('registration.uploadHint')}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                                {errors.photo && (
                                                    <span className="text-[10px] text-red-500 font-semibold mt-1 ml-1 block">{errors.photo}</span>
                                                )}
                                            </div>

                                            {/* Submit & Back Buttons */}
                                            <div className="pt-2 space-y-4">
                                                <button
                                                    type="submit"
                                                    disabled={status === 'loading'}
                                                    className="btn-premium-action group"
                                                >
                                                    {status === 'loading' ? (
                                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                                    ) : (
                                                        <>
                                                            <span>{t('registration.submitButton')}</span>
                                                            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="flex items-center justify-center gap-2 mx-auto text-[10px] uppercase tracking-widest text-white/30 hover:text-white font-bold transition-colors py-2 group cursor-pointer"
                                                >
                                                    <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
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
