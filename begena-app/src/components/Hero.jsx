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
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/90 via-dark-900/60 to-dark-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 to-transparent" />
            </div>

            {/* Animated Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/6 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/4 rounded-full blur-[150px]" />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-gold-400/40 rounded-full animate-float" />
                <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-gold-300/30 rounded-full animate-float [animation-delay:1s]" />
                <div className="absolute top-[60%] left-[70%] w-1 h-1 bg-gold-500/30 rounded-full animate-float [animation-delay:2s]" />
                <div className="absolute top-[30%] right-[40%] w-0.5 h-0.5 bg-gold-400/50 rounded-full animate-float [animation-delay:0.5s]" />
                <div className="absolute top-[70%] left-[30%] w-1 h-1 bg-gold-300/40 rounded-full animate-float [animation-delay:1.5s]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-gold-500/20 backdrop-blur-sm shadow-[0_0_20px_rgba(200,146,45,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(200,146,45,0.6)] animate-pulse" />
                    <span className="text-gold-300 text-xs font-medium tracking-[0.2em] uppercase">
                        Ancient Ethiopian Art
                    </span>
                </div>

                <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold mb-8 leading-[1.1] tracking-tight">
                    <span className="text-white">Learn the </span>
                    <span className="relative inline-block">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
                            Sacred Sound
                        </span>
                        <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-gold-400/0 via-gold-400/80 to-gold-400/0 rounded-full shadow-[0_0_12px_rgba(200,146,45,0.5)]" />
                    </span>
                    <br />
                    <span className="text-white">of </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300 italic">
                        Begena
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-brown-200/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    Join our spiritual and traditional Begena training program and master the ancient Ethiopian harp —
                    an instrument of meditation, prayer, and deep cultural heritage.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#register"
                        className="group relative inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-dark-900 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(200,146,45,0.5),0_0_80px_rgba(200,146,45,0.2)] animate-float"
                    >
                        Register Now
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {/* Glow ring behind button */}
                        <span className="absolute -inset-1 rounded-full bg-gold-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </a>
                    <a
                        href="#about"
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-brown-200 border border-white/10 rounded-full hover:border-gold-500/30 hover:bg-white/5 hover:text-gold-300 transition-all duration-300 backdrop-blur-sm"
                    >
                        Learn More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </a>
                </div>

                {/* Stats row */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {[
                        { value: '500+', label: 'Students Trained' },
                        { value: '50+', label: 'Lessons Available' },
                        { value: '10+', label: 'Years Experience' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-500 group-hover:from-gold-200 group-hover:to-gold-400 transition-all duration-300">
                                {stat.value}
                            </div>
                            <div className="text-xs text-brown-300/60 mt-1 tracking-wide uppercase">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-80 transition-opacity">
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2.5 bg-gold-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(200,146,45,0.5)]" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
