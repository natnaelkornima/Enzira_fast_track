const Footer = () => {
    return (
        <footer id="contact" className="relative pt-16 pb-8 px-6">
            {/* Gold accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🎵</span>
                            <span className="font-heading text-xl font-semibold text-gold-400">
                                Begena Training
                            </span>
                        </div>
                        <p className="text-brown-300 text-sm leading-relaxed max-w-xs">
                            Preserving and teaching the sacred art of Begena — Ethiopia&apos;s ancient instrument of meditation and spiritual expression.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-brown-100 mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#about" className="text-brown-300 hover:text-gold-400 transition-colors duration-300 text-sm">
                                    About the Training
                                </a>
                            </li>
                            <li>
                                <a href="#register" className="text-brown-300 hover:text-gold-400 transition-colors duration-300 text-sm">
                                    Register Now
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-brown-300 hover:text-gold-400 transition-colors duration-300 text-sm">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h4 className="font-heading text-lg font-semibold text-brown-100 mb-4">Connect With Us</h4>
                        <div className="space-y-3 mb-6">
                            <a
                                href="mailto:info@begenatraining.com"
                                className="flex items-center gap-3 text-brown-300 hover:text-gold-400 transition-colors duration-300 text-sm"
                            >
                                <span className="text-lg">📧</span>
                                info@begenatraining.com
                            </a>
                            <a
                                href="tel:+251911000000"
                                className="flex items-center gap-3 text-brown-300 hover:text-gold-400 transition-colors duration-300 text-sm"
                            >
                                <span className="text-lg">📞</span>
                                +251 911 000 000
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://t.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gold-500/20 transition-all duration-300 group"
                                aria-label="Telegram"
                            >
                                <svg className="w-5 h-5 text-brown-300 group-hover:text-gold-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.97 9.287c-.145.658-.537.817-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.935z" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-gold-500/20 transition-all duration-300 group"
                                aria-label="YouTube"
                            >
                                <svg className="w-5 h-5 text-brown-300 group-hover:text-gold-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 text-center">
                    <p className="text-brown-400 text-xs tracking-wide">
                        © {new Date().getFullYear()} Begena Training. All rights reserved. Made with ♡ for Ethiopian heritage.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
