import { motion } from 'framer-motion';
import { History, GraduationCap, Music, PlayCircle, Heart, Star, Shield, Sun } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: History,
            title: "Ancient Roots",
            description: "Dating back to the time of King David, the Begena is one of Ethiopia's oldest and most revered instruments.",
            color: "brand-red"
        },
        {
            icon: Music,
            title: "Spiritual Sound",
            description: "Known as the 'Harp of David', its deep, resonant tones are uniquely designed for meditation and spiritual praise.",
            color: "brand-red"
        },
        {
            icon: GraduationCap,
            title: "Expert Guidance",
            description: "Our training program is led by masters who have dedicated their lives to preserving this sacred art.",
            color: "brand-red"
        },
        {
            icon: PlayCircle,
            title: "Interactive Learning",
            description: "A comprehensive curriculum that combines traditional techniques with modern pedagogical approaches.",
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
                        <h4 className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs mb-6">Our Legacy</h4>
                        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                            The Sacred <br />
                            <span className="italic text-transparent bg-clip-text bg-linear-to-r from-brand-red to-white">Art of Devotion</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-xl">
                            The Begena is more than an instrument; it is a gateway to the soul. For millennia, it has been the companion of hermits, kings, and the faithful, resonating through the highlands of Ethiopia.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Shield, label: 'Traditional Preservation' },
                                { icon: Star, label: 'Spiritual Excellence' },
                                { icon: Heart, label: 'Community Focused' },
                                { icon: Sun, label: 'Cultural Heritage' }
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
                        className="relative"
                    >
                        <div className="aspect-square rounded-4xl overflow-hidden glass p-4 border-white/5 relative group">
                            <div className="absolute inset-4 rounded-3xl bg-brand-red/20 mix-blend-overlay group-hover:bg-brand-red/10 transition-all duration-700" />
                            <img
                                src="./begena-app/src/assets/amanuel-yit-trial8w.jpg"
                                alt="Begena Strings"
                                className="w-full h-full object-cover rounded-3xl grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Decorative Frame */}
                            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-brand-red/50 rounded-tl-3xl" />
                            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-brand-red/50 rounded-br-3xl" />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="glass-card p-10 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-8 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-500">
                                <feature.icon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-white mb-4 group-hover:text-brand-red transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-white/30 text-sm leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
