import { motion } from 'framer-motion';
import {
    Music, Send, Youtube, Instagram,
    Mail, Phone, ArrowUpRight, Heart, Sparkles
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Youtube, label: 'YouTube', href: '#' },
        { icon: Instagram, label: 'Instagram', href: '#' },
        { icon: Send, label: 'Telegram', href: '#' }
    ];

    const quickLinks = [
        { name: 'About the Art', href: '#about' },
        { name: 'Training Modules', href: '#training' },
        { name: 'Global Admissions', href: '#register' },
        { name: 'Sacred History', href: '#' }
    ];

    return (
        <footer className="relative bg-dark-950 pt-24 pb-12 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-brand-red/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20">
                                <Music className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="font-heading text-2xl font-black text-white tracking-tighter">
                                Begena<span className="text-brand-red">.</span>
                            </span>
                        </motion.div>
                        <p className="text-white/30 text-lg leading-relaxed max-w-md font-light mb-10">
                            Dedicated to the preservation and teaching of Ethiopia's most sacred musical heritage. Join us in carrying forward the Harp of David.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-brand-red/30 hover:bg-brand-red/5 transition-all text-white/30 hover:text-brand-red"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-10">Exploration</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-sm text-white/30 hover:text-brand-red transition-all flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-brand-red scale-0 group-hover:scale-100 transition-transform" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-10">Connect</h4>
                        <div className="space-y-6">
                            <a href="mailto:info@begena.org" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-red transition-all">
                                    <Mail className="w-4 h-4 text-brand-red" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Email Us</p>
                                    <p className="text-sm text-white/60 group-hover:text-white transition-colors">info@begena.org</p>
                                </div>
                            </a>
                            <a href="tel:+251911223344" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-red transition-all">
                                    <Phone className="w-4 h-4 text-brand-red" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Call Center</p>
                                    <p className="text-sm text-white/60 group-hover:text-white transition-colors">+251 911 22 33 44</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        <span>© {currentYear} Begena Fast Track </span>
                        <div className="w-1 h-1 rounded-full bg-brand-red" />
                        <span>All Rights Reserved</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">Handcrafted by</span>
                            <Sparkles className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                            <span className="text-[10px] font-black text-brand-red uppercase tracking-widest bg-brand-red/10 px-3 py-1 rounded-full">Begena Tech</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
