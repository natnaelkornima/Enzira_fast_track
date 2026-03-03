import { motion } from 'framer-motion';
import { Music, Send, Youtube, Mail, Phone, ArrowUpRight, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="relative pt-24 pb-12 px-6 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-600/5 rounded-full blur-[100px]" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-8 group cursor-pointer w-fit">
                            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/50 transition-all duration-500">
                                <Music className="w-5 h-5 text-dark-900" strokeWidth={2.5} />
                            </div>
                            <span className="font-heading text-xl font-bold text-white tracking-tight">
                                Begena<span className="text-gold-400">.</span>
                            </span>
                        </div>
                        <p className="text-brown-100/50 text-sm leading-relaxed mb-8 max-w-xs font-light">
                            Preserving the sacred art of Begena — Ethiopia&apos;s ancient harp of meditation and spiritual praise.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Send, label: 'Telegram', href: 'https://t.me/' },
                                { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/' }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brown-100/40 hover:text-gold-400 hover:border-gold-500/30 transition-all shadow-xl"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading text-white font-bold mb-8 tracking-widest uppercase text-xs">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About', href: '#about' },
                                { name: 'Register', href: '#register' },
                                { name: 'Tradition', href: '#' },
                                { name: 'Support', href: '#' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        className="text-brown-100/40 hover:text-gold-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-gold-500/0 group-hover:bg-gold-500 transition-all" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading text-white font-bold mb-8 tracking-widest uppercase text-xs">Contact</h4>
                        <ul className="space-y-6">
                            <li>
                                <a href="mailto:info@begenatraining.com" className="group block">
                                    <span className="text-brown-100/30 text-[10px] uppercase font-bold tracking-widest block mb-1">Email Us</span>
                                    <span className="text-brown-100/60 group-hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        info@begenatraining.com
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+251911000000" className="group block">
                                    <span className="text-brown-100/30 text-[10px] uppercase font-bold tracking-widest block mb-1">Call Us</span>
                                    <span className="text-brown-100/60 group-hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        +251 911 000 000
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/CTA */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-white font-bold mb-2">Join Our Newsletter</h4>
                                <p className="text-brown-100/40 text-xs mb-4">Stay updated with class schedules and spiritual gatherings.</p>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full bg-dark-900 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-brown-100/20 focus:outline-hidden focus:border-gold-500/50 transition-all"
                                    />
                                    <button className="absolute right-2 top-1.5 p-1.5 bg-gold-500 rounded-lg group-hover:bg-gold-400 transition-colors">
                                        <ArrowUpRight className="w-4 h-4 text-dark-900" />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold-400/5 blur-2xl group-hover:bg-gold-400/10 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-brown-100/30 text-[10px] uppercase font-bold tracking-widest">
                        © {currentYear} Begena Training Center. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-6 text-brown-100/30 text-[10px] uppercase font-bold tracking-widest">
                        <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
                        <span className="flex items-center gap-1.5">
                            Made with <Heart className="w-3 h-3 text-red-500/50" /> in Ethiopia
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
