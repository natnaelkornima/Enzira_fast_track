import { motion } from 'framer-motion';
import { History, GraduationCap, Music, PlayCircle, Heart, Star, Shield, Sun } from 'lucide-react';
import begenaImg from '../assets/about-image.jpg';
import { useLanguage } from '../lib/LanguageContext';

const About = () => {
    const { t } = useLanguage();
    const features = [
        {
            icon: History,
            title: t('about.feature1Title'),
            description: t('about.feature1Desc'),
            color: "brand-red"
        },
        {
            icon: Music,
            title: t('about.feature2Title'),
            description: t('about.feature2Desc'),
            color: "brand-red"
        },
        {
            icon: GraduationCap,
            title: t('about.feature3Title'),
            description: t('about.feature3Desc'),
            color: "brand-red"
        },
        {
            icon: PlayCircle,
            title: t('about.feature4Title'),
            description: t('about.feature4Desc'),
            color: "brand-red"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="about" className="section-container relative overflow-hidden bg-dark-950">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-6">{t('about.subtitle')}</h4>
                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                            {t('about.titleLine1')} <br />
                            <span className="italic text-transparent bg-clip-text bg-linear-to-r from-brand-red to-white">{t('about.titleLine2')}</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-xl">
                            {t('about.description')}
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Shield, label: t('about.pill1') },
                                { icon: Star, label: t('about.pill2') },
                                { icon: Heart, label: t('about.pill3') },
                                { icon: Sun, label: t('about.pill4') }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-red/30 transition-all">
                                        <item.icon className="w-5 h-5 text-brand-red" />
                                    </div>
                                    <span className="text-xs font-bold text-white/50 group-hover:text-white transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 group"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-brand-red/20 rounded-2xl blur-2xl group-hover:bg-brand-red/30 transition-all duration-700 opacity-50 group-hover:opacity-100" />

                        <div className="aspect-4/5 w-full rounded-2xl overflow-hidden bg-dark-900 border border-white/10 relative transform transition-all duration-700 group-hover:-translate-y-4 shadow-2xl shadow-black/50 group-hover:shadow-[0_20px_60px_-15px_rgba(152,28,0,0.5)]">
                            <div className="absolute inset-0 bg-linear-to-tr from-brand-red/30 to-transparent mix-blend-overlay z-10 opacity-70 group-hover:opacity-30 transition-opacity duration-700" />
                            <img
                                src={begenaImg}
                                alt="Enzira Strings"
                                className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />

                            {/* Modern Decorative Accent */}
                            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-white/50 rounded-tl-3xl z-20 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110" />
                            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-white/50 rounded-br-3xl z-20 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110" />
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -right-8 top-1/4 w-16 h-16 glass rounded-xl hidden md:flex items-center justify-center animate-float shadow-xl z-30 border border-white/10">
                            <Star className="w-6 h-6 text-brand-red" />
                        </div>
                        <div className="absolute -left-6 bottom-1/4 w-12 h-12 glass rounded-full hidden md:flex items-center justify-center animate-float shadow-xl z-30 border border-white/10" style={{ animationDelay: '1s' }}>
                            <Music className="w-4 h-4 text-white" />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="glass-card p-8 group relative overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-red/0 group-hover:bg-brand-red/10 rounded-full blur-2xl transition-all duration-700 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-red/20 to-brand-red/5 border border-brand-red/20 flex items-center justify-center mb-6 group-hover:from-brand-red group-hover:to-brand-red-light group-hover:border-brand-red transition-all duration-500">
                                    <feature.icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="font-heading text-lg font-bold text-white mb-3 relative overflow-hidden">
                                    <span className="relative z-10 bg-linear-to-r from-white to-white bg-[length:0%_100%] bg-no-repeat group-hover:bg-[length:100%_100%] bg-clip-text group-hover:text-transparent transition-all duration-700">
                                        {feature.title}
                                    </span>
                                </h3>
                                <p className="text-white/30 text-sm leading-relaxed font-light group-hover:text-white/50 transition-colors duration-500">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-linear-to-r from-brand-red to-transparent group-hover:w-full transition-all duration-700" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
