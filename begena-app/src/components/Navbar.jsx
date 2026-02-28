import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'py-2 bg-dark-900/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(200,146,45,0.08)] border-b border-gold-600/10'
                    : 'py-4 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group relative">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_20px_rgba(200,146,45,0.3)] group-hover:shadow-[0_0_30px_rgba(200,146,45,0.5)] transition-all duration-300">
                            <span className="text-white text-sm font-bold">♪</span>
                        </div>
                        <div className="absolute -inset-1 rounded-xl bg-gold-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-heading text-lg font-bold text-white tracking-wide">
                        Begena<span className="text-gold-400">.</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { label: 'About', href: '#about' },
                        { label: 'Register', href: '#register' },
                        { label: 'Contact', href: '#contact' },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="relative px-5 py-2 text-sm font-medium text-brown-200/80 hover:text-white transition-colors duration-300 group"
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-3/4 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(200,146,45,0.5)]" />
                        </a>
                    ))}
                    <a
                        href="#register"
                        className="ml-4 px-6 py-2.5 text-sm font-semibold text-dark-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full hover:shadow-[0_0_25px_rgba(200,146,45,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-gold-500/30 transition-all duration-300"
                    aria-label="Toggle menu"
                >
                    <div className="flex flex-col gap-1.5">
                        <span className={`w-5 h-0.5 bg-brown-200 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-5 h-0.5 bg-brown-200 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-5 h-0.5 bg-brown-200 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-dark-900/95 backdrop-blur-2xl border-b border-gold-600/10 transition-all duration-500 overflow-hidden ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-6 space-y-1">
                    {[
                        { label: 'About', href: '#about' },
                        { label: 'Register', href: '#register' },
                        { label: 'Contact', href: '#contact' },
                    ].map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-brown-200 hover:text-gold-400 hover:bg-white/5 rounded-xl transition-all duration-300 text-sm font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#register"
                        onClick={() => setMobileOpen(false)}
                        className="block mt-3 text-center px-6 py-3 text-sm font-semibold text-dark-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-xl hover:shadow-[0_0_25px_rgba(200,146,45,0.5)] transition-all duration-300"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
