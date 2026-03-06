import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, ArrowLeft, Phone, Send, Loader2, Copy, Check, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

const CheckStatus = () => {
    const { t, language } = useLanguage();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | found | not_found | error
    const [errorMsg, setErrorMsg] = useState('');
    const [copiedField, setCopiedField] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phoneNumber.trim()) return;

        setStatus('loading');
        setResult(null);

        try {
            const cleanPhone = phoneNumber.replace(/\D/g, ''); // Extract only digits
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .filter('phone_number', 'ilike', `%${cleanPhone}%`)
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                setStatus('not_found');
            } else {
                setResult({
                    fullName: data.full_name,
                    phone: `${data.country_code} ${data.phone_number}`,
                    telegram: data.telegram,
                    status: data.status,
                    date: new Date(data.created_at).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })
                });
                setStatus('found');
            }
        } catch (err) {
            setErrorMsg(t('checkStatus.error'));
            setStatus('error');
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />

            {/* Back Link */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium z-20"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('checkStatus.backToHome')}
            </Link>

            <div className="w-full max-w-5xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

                    {/* Left Side: Search Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:max-w-md shrink-0"
                    >
                        <div className="text-left mb-8">
                            <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-red/20 shadow-[0_0_20px_rgba(152,28,0,0.1)]">
                                <Search className="w-7 h-7 text-brand-red" />
                            </div>
                            <h1 className="text-3xl font-black font-heading text-white mb-3 tracking-tight">{t('checkStatus.title')}</h1>
                            <p className="text-white/40 text-sm leading-relaxed max-w-sm">{t('checkStatus.desc')}</p>
                        </div>

                        <form onSubmit={handleSearch} className="glass rounded-2xl p-8 border border-white/5 shadow-2xl">
                            <div className="space-y-2 mb-6">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-1">{t('checkStatus.inputLabel')}</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="911 22 33 44"
                                        className="w-full pr-6 pl-12 py-4 rounded-xl bg-dark-900/50 border border-white/10 text-white placeholder-white/20 transition-all duration-300 focus:outline-hidden focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 rounded-xl bg-brand-red text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(152,28,0,0.4)] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-[0.98]"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {t('checkStatus.button')}
                                        <Search className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Right Side: Results */}
                    <div className="w-full flex-1 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {status === 'found' && result ? (
                                <motion.div
                                    key="found"
                                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                    className="glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl h-full flex flex-col"
                                >
                                    {/* Status Hero Section */}
                                    <div className={`p-10 flex flex-col items-center text-center relative overflow-hidden ${result.status === 'verified' ? 'bg-green-500/5' :
                                            result.status === 'declined' ? 'bg-red-500/5' : 'bg-yellow-500/5'
                                        }`}>
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            {result.status === 'verified' ? <CheckCircle className="w-32 h-32" /> :
                                                result.status === 'declined' ? <AlertCircle className="w-32 h-32" /> : <Clock className="w-32 h-32" />}
                                        </div>

                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', damping: 12 }}
                                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-2xl ${result.status === 'verified' ? 'bg-green-500 text-white shadow-green-500/20' :
                                                    result.status === 'declined' ? 'bg-red-500 text-white shadow-red-500/20' :
                                                        'bg-yellow-500 text-white shadow-yellow-500/20'
                                                }`}
                                        >
                                            {result.status === 'verified' ? <CheckCircle className="w-10 h-10" /> :
                                                result.status === 'declined' ? <AlertCircle className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                                        </motion.div>

                                        <h2 className={`text-2xl font-black mb-2 px-6 ${result.status === 'verified' ? 'text-green-400' :
                                                result.status === 'declined' ? 'text-red-400' : 'text-yellow-400'
                                            }`}>
                                            {result.status === 'verified' ? t('checkStatus.verifiedTitle') :
                                                result.status === 'declined' ? t('checkStatus.declinedTitle') : t('checkStatus.pendingTitle')}
                                        </h2>
                                        <p className="text-white/40 text-sm max-w-xs">{
                                            result.status === 'verified' ? t('checkStatus.verifiedDesc') :
                                                result.status === 'declined' ? t('checkStatus.declinedDesc') : t('checkStatus.pendingDesc')
                                        }</p>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/2 border-t border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{t('registration.fullName')}</p>
                                            <p className="text-white font-bold">{result.fullName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{t('checkStatus.registeredOn')}</p>
                                            <p className="text-white font-bold">{result.date}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{t('registration.phoneNumber')}</p>
                                            <p className="text-white font-bold">{result.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{t('registration.telegram')}</p>
                                            <p className="text-white font-bold">{result.telegram}</p>
                                        </div>
                                    </div>

                                    {/* Action/Support Section for Declined */}
                                    {result.status === 'declined' && (
                                        <div className="p-8 bg-brand-red/5 border-t border-brand-red/10">
                                            <p className="text-xs font-bold text-red-400/80 mb-4 uppercase tracking-widest">Need help? Contact Admin</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => copyToClipboard('+251920312156', 'phone')}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-red-500/30 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="w-4 h-4 text-red-400" />
                                                        <span className="text-xs text-white/80">+251920312156</span>
                                                    </div>
                                                    {copiedField === 'phone' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />}
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard('kirubelhabtamuenyew@gmail.com', 'email')}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-white/5 hover:border-red-500/30 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Mail className="w-4 h-4 text-red-400" />
                                                        <span className="text-xs text-white/80 truncate max-w-[120px]">kirubelhabtamuenyew@gmail.com</span>
                                                    </div>
                                                    {copiedField === 'email' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : status === 'not_found' ? (
                                <motion.div
                                    key="not_found"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center text-center p-12 h-full"
                                >
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                        <AlertCircle className="w-10 h-10 text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Registration Found</h3>
                                    <p className="text-white/40 text-sm max-w-xs">{t('checkStatus.notFound')}</p>
                                </motion.div>
                            ) : status === 'idle' ? (
                                <div className="flex flex-col items-center justify-center text-center p-12 h-full border-2 border-dashed border-white/5 rounded-2xl">
                                    <div className="w-16 h-16 bg-white/2 rounded-full flex items-center justify-center mb-4 text-white/10">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <p className="text-white/20 text-sm italic">Waiting for your search...</p>
                                </div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckStatus;
