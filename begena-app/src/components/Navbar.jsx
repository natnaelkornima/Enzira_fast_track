import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Music, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About', href: '#about' },
        { name: 'Training', href: '#training' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${isScrolled ? 'top-2' : 'top-0'
                }`}
        >
            <div className={`max-w-7xl mx-auto transition-all duration-500 ${isScrolled
                ? 'glass rounded-4xl px-8 py-3 shadow-2xl border-white/10'
                : 'bg-transparent py-5'
                }`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-brand-red to-brand-red-light flex items-center justify-center shadow-lg group-hover:shadow-brand-red/50 transition-all duration-500">
                            <Music className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-heading text-xl font-bold text-white tracking-tight">
                            Begena<span className="text-brand-red">.</span>
                        </span>
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

                    {/* Desktop Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:block"
                    >
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
                        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
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
