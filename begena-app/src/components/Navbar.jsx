import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'About', href: '#about' },
        { label: 'Register', href: '#register' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'py-3 bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="#"
                    className="flex items-center gap-3 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/50 transition-all duration-500">
                            <Music className="w-5 h-5 text-dark-900" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -inset-1 rounded-2xl bg-gold-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <span className="font-heading text-xl font-bold text-white tracking-tight">
                        Begena<span className="text-gold-400">.</span>
                    </span>
                </motion.a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link, i) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                            className="relative px-5 py-2 text-sm font-medium text-brown-100/70 hover:text-white transition-colors duration-300 group"
                        >
                            {link.label}
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold-400 group-hover:w-1/3 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(200,146,45,0.5)]" />
                        </motion.a>
                    ))}
                    <motion.a
                        href="#register"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary ml-4 !px-7 !py-2.5 text-sm"
                    >
                        Get Started
                    </motion.a>
                </div>

                {/* Mobile hamburger */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-all duration-300"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden absolute top-full left-0 right-0 bg-dark-900/95 backdrop-blur-3xl border-b border-white/5 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-2">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between px-5 py-4 text-brown-100 hover:text-gold-400 hover:bg-white/5 rounded-2xl transition-all duration-300 text-lg font-medium group"
                                >
                                    {link.label}
                                    <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                            ))}
                            <motion.a
                                href="#register"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setMobileOpen(false)}
                                className="block mt-6 text-center btn-primary w-full py-4 text-lg"
                            >
                                Get Started
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
