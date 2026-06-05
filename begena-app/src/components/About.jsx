import { motion } from 'framer-motion';
import { History, GraduationCap, Music, PlayCircle, Heart, Star, Shield, Sun } from 'lucide-react';
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
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <h4 className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-6">{t('about.subtitle')}</h4>
                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                            {t('about.titleLine1')} <br />
                            <span className="italic text-white">{t('about.titleLine2')}</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-2xl">
                            {t('about.description')}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full justify-center">
                            {[
                                { icon: Shield, label: t('about.pill1') },
                                { icon: Star, label: t('about.pill2') },
                                { icon: Heart, label: t('about.pill3') },
                                { icon: Sun, label: t('about.pill4') }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-brand-red/30 transition-all w-full group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-red/30 transition-all">
                                        <item.icon className="w-5 h-5 text-brand-red" />
                                    </div>
                                    <span className="text-xs font-bold text-white/50 group-hover:text-white transition-colors">{item.label}</span>
                                </div>
                            ))}
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
                                    <span className="relative z-10">
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
