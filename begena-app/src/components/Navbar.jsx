import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Shield, ClipboardCheck, Settings, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/enzira-logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Training', href: '#register' },
        { name: 'Contact', href: '#footer' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${isScrolled ? 'top-2' : 'top-0'
                }`}
        >
            <div className={`max-w-7xl mx-auto transition-all duration-500 ${isScrolled
                ? 'bg-dark-950/90 rounded-2xl px-8 py-3 shadow-2xl backdrop-blur-xl border border-transparent'
                : 'bg-transparent py-5 border border-transparent'
                }`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <img src={logoImg} alt="Enzira Logo" className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full" />
                            </motion.a>
                        ))}

                    </div>

                    {/* Desktop Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:flex items-center gap-3"
                    >
                        <Link
                            to="/status"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-white/60 hover:text-white hover:border-white/10 transition-all text-sm font-medium"
                        >
                            <ClipboardCheck className="w-4 h-4" />
                            Check Status
                        </Link>

                        {/* Settings Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`p-2.5 rounded-2xl border transition-all ${isSettingsOpen
                                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/10'
                                    }`}
                            >
                                <Settings className={`w-5 h-5 transition-transform duration-500 ${isSettingsOpen ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSettingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-dark-900 border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-50 backdrop-blur-xl"
                                    >
                                        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/70 hover:text-brand-red group w-full text-left">
                                            <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold group-hover:border-brand-red/30 transition-colors">
                                                EN
                                            </div>
                                            <span className="text-sm font-medium">አማርኛ</span>
                                        </button>
                                        <div className="h-px bg-white/5 my-1 mx-2" />
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsSettingsOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-white/70 hover:text-white group w-full text-left"
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span className="text-sm font-medium">Admin Login</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <a
                            href="#register"
                            className="btn-primary py-2.5! px-7! text-sm group"
                        >
                            <span>Enroll Now</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-white/70 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-6 right-6 mt-4 md:hidden"
                    >
                        <div className="glass rounded-xl p-8 shadow-2xl">
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-white/70 hover:text-brand-red transition-colors flex items-center justify-between group"
                                    >
                                        {link.name}
                                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </a>
                                ))}

                                {/* Mobile Language Switcher */}
                                <button
                                    className="text-lg font-medium text-white/70 hover:text-brand-red transition-colors flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[11px] bg-white/5 group-hover:border-brand-red group-hover:text-brand-red transition-all">
                                            EN
                                        </span>
                                        አማርኛ (Amharic)
                                    </span>
                                </button>

                                <Link
                                    to="/status"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-white/70 hover:text-brand-red transition-colors flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Check Status</span>
                                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-white/70 hover:text-brand-red transition-colors flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-2"><Shield className="w-5 h-5" /> Admin Login</span>
                                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </Link>
                                <a
                                    href="#register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn-primary w-full py-4 text-lg font-bold"
                                >
                                    Enroll Now
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
