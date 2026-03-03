import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Award, BookOpen, Clock } from 'lucide-react';

const Hero = () => {
    const stats = [
        { value: '500+', label: 'Students Trained', icon: Award },
        { value: '50+', label: 'Lessons Available', icon: BookOpen },
        { value: '10+', label: 'Years Experience', icon: Clock },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    src="/begena-hero.png"
                    alt="Begena instrument"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/90 via-dark-900/40 to-dark-900" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-transparent" />
            </div>

            {/* Animated Glow Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] animate-glow" />
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[100px] animate-glow [animation-delay:-2s]" />

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-6 max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 inline-flex items-center gap-2.5 px-6 py-2 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-sm shadow-xl"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                    </span>
                    <span className="text-gold-300 text-xs font-bold tracking-[0.25em] uppercase">
                        Ancient Ethiopian Heritage
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
                >
                    <span className="text-white">Learn the </span>
                    <span className="relative inline-block">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500">
                            Sacred Sound
                        </span>
                        <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent origin-center"
                        />
                    </span>
                    <br />
                    <span className="text-white">of </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brown-200/50 italic">
                        Begena
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-brown-100/60 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Master the ancient Ethiopian harp — an instrument of meditation, prayer,
                    and deep spiritual heritage through our professional training program.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                    <motion.a
                        href="#register"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary group !px-10 !py-4.5 text-lg"
                    >
                        Begin Your Journey
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                        href="#about"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary !px-10 !py-4.5 text-lg"
                    >
                        Explore More
                    </motion.a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    variants={itemVariants}
                    className="mt-20 flex flex-wrap items-center justify-center gap-10 md:gap-20"
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="flex items-center justify-center mb-3">
                                <stat.icon className="w-6 h-6 text-gold-500/40 group-hover:text-gold-400 transition-colors" strokeWidth={1.5} />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white group-hover:text-gold-300 transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-[10px] text-brown-300/40 mt-1.5 tracking-[0.2em] uppercase font-bold">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center p-1.5"
                >
                    <div className="w-1 h-2 bg-gold-500 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
