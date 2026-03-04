import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, ArrowLeft, Phone, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | found | not_found | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phoneNumber.trim()) return;

        setStatus('loading');
        setResult(null);

        try {
            const cleanPhone = phoneNumber.replace(/\s/g, '');
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .ilike('phone_number', `%${cleanPhone}%`)
                .limit(1)
                .single();

            if (error || !data) {
                setStatus('not_found');
            } else {
                setResult({
                    fullName: data.full_name,
                    phone: `${data.country_code} ${data.phone_number}`,
                    telegram: data.telegram,
                    status: data.status,
                    date: new Date(data.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })
                });
                setStatus('found');
            }
        } catch (err) {
            setErrorMsg('Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] -z-10" />

            {/* Back Link */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium z-20"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Search className="w-8 h-8 text-brand-red" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-white mb-2">Check Registration Status</h1>
                    <p className="text-white/40 text-sm">Enter your phone number to see your payment approval status.</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="glass rounded-3xl p-8 border border-white/5 mb-6">
                    <div className="space-y-2 mb-6">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Phone Number</label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="911 22 33 44"
                                className="w-full pr-6 pl-14 py-4 rounded-2xl bg-dark-900 border border-white/5 text-white placeholder-white/20 transition-all duration-300 focus:outline-hidden focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 rounded-2xl bg-brand-red text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(152,28,0,0.3)] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Check Status
                                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {status === 'found' && result && (
                        <motion.div
                            key="found"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-3xl p-8 border border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-lg">
                                    {result.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{result.fullName}</h3>
                                    <p className="text-white/30 text-xs">Registered on {result.date}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 text-white/60 text-sm">
                                    <Phone className="w-4 h-4 text-white/30" />
                                    <span>{result.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/60 text-sm">
                                    <Send className="w-4 h-4 text-white/30" />
                                    <span>{result.telegram}</span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${result.status === 'verified'
                                    ? 'bg-green-500/10 border border-green-500/20'
                                    : 'bg-yellow-500/10 border border-yellow-500/20'
                                }`}>
                                {result.status === 'verified' ? (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <div>
                                            <p className="text-green-400 font-bold text-sm">Payment Verified ✓</p>
                                            <p className="text-green-400/60 text-xs">Your registration has been approved. Welcome aboard!</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-6 h-6 text-yellow-400" />
                                        <div>
                                            <p className="text-yellow-400 font-bold text-sm">Payment Pending</p>
                                            <p className="text-yellow-400/60 text-xs">Your payment is being reviewed. Please check back later.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {status === 'not_found' && (
                        <motion.div
                            key="not_found"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            No registration found with this phone number. Make sure you entered the correct number.
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CheckStatus;
