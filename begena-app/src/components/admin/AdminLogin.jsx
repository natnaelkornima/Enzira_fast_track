import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (signInError) {
                setError(signInError.message || 'Invalid credentials');
                setStatus('error');
            } else if (data.session) {
                // Application-level security check: Only allow the specific admin email
                const ALLOWED_ADMIN_EMAIL = 'admin@begena.com';

                if (data.session.user.email !== ALLOWED_ADMIN_EMAIL) {
                    // Force logout the unauthorized user immediately
                    await supabase.auth.signOut();
                    setError('Access denied. This portal is restricted to authorized administrators only.');
                    setStatus('error');
                    return;
                }

                setStatus('success');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Server error. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass rounded-2xl p-8 md:p-12 border border-white/5 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-brand-red" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-white mb-2">Owner Portal</h1>
                    <p className="text-white/40 text-sm">Sign in to manage registrations and verify payments.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={credentials.email}
                                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder="admin@begena.com"
                                className="w-full pr-6 pl-14 py-4 rounded-2xl bg-dark-900 border border-white/5 text-white placeholder-white/20 transition-all duration-300 focus:outline-hidden focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-4">Password</label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-red transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full pr-6 pl-14 py-4 rounded-2xl bg-dark-900 border border-white/5 text-white placeholder-white/20 transition-all duration-300 focus:outline-hidden focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 rounded-2xl bg-brand-red text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(152,28,0,0.3)] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
