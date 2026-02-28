const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="#" className="flex items-center gap-3 group">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🎵</span>
                    <span className="font-heading text-xl font-semibold text-gold-400 tracking-wide">
                        Begena Training
                    </span>
                </a>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="text-brown-200 hover:text-gold-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                        About
                    </a>
                    <a href="#register" className="text-brown-200 hover:text-gold-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                        Register
                    </a>
                    <a href="#contact" className="text-brown-200 hover:text-gold-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                        Contact
                    </a>
                </div>
                <a href="#register" className="md:hidden glow-btn !py-2 !px-5 !text-sm">
                    Register
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
