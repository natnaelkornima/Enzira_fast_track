const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="/begena-hero.png"
                    alt="Begena instrument"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-800/70 to-dark-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/50 to-transparent" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gold-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <span className="inline-block px-4 py-2 glass rounded-full text-gold-400 text-sm font-medium tracking-widest uppercase mb-8">
                        ✦ Ancient Ethiopian Art ✦
                    </span>
                </div>

                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                    <span className="text-brown-50">Learn the </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
                        Sacred Sound
                    </span>
                    <br />
                    <span className="text-brown-50">of </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-400 italic">
                        Begena
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-brown-200/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                    Join our spiritual and traditional Begena training program and master the ancient Ethiopian harp —
                    an instrument of meditation, prayer, and deep cultural heritage.
                </p>

                <a
                    href="#register"
                    className="glow-btn animate-float inline-block text-lg"
                >
                    Register Now
                </a>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
                    <span className="text-xs text-brown-300 tracking-widest uppercase">Scroll</span>
                    <div className="w-5 h-8 border-2 border-brown-400/40 rounded-full flex justify-center pt-1">
                        <div className="w-1 h-2 bg-gold-400 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
