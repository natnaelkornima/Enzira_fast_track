import { motion } from 'framer-motion';
import { Award, BookOpen, Clock, Play, ArrowRight } from 'lucide-react';
import RippleGrid from './RippleGrid';

const Hero = () => {
    const stats = [
        { icon: Award, label: 'Traditional Mastery', value: '100%' },
        { icon: BookOpen, label: 'Spiritual Paths', value: '12+' },
        { icon: Clock, label: 'Training Hours', value: '500+' },
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 pt-20">
            {/* Ripple Grid Background */}
            <RippleGrid
                gridColor="#981c00"
                rippleColor="#ffffff"
                opacity={0.15}
                gridSize={60}
                rippleIntensity={15}
            />

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] animate-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 container mx-auto px-6 text-center"
            >
                {/* Floating Badge */}
                <motion.div variants={itemVariants} className="mb-10 flex justify-center">
                    <span className="group flex items-center gap-2 px-5 py-2 glass rounded-full border border-white/5 hover:border-brand-red/30 transition-all duration-500 cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
                            Sacred Ethiopian Heritage
                        </span>
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="max-w-5xl mx-auto mb-10">
                    <h1 className="font-heading text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter">
                        Soul of <br />
                        <span className="italic text-transparent bg-clip-text bg-linear-to-r from-brand-red via-brand-red-light to-white">
                            Begena
                        </span>
                    </h1>
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-12">
                    <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed">
                        Journey through centuies of tradition. Our expert-led training unlocks the meditative
                        and spiritual power of Ethiopia's most sacred harp.
                    </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary px-10 py-5 rounded-full"
                    >
                        <span>Start Learning</span>
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary px-10 py-5 rounded-full group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors" />
                        <Play className="w-5 h-5 text-brand-red group-hover:text-white transition-colors relative z-10" />
                        <span className="relative z-10">Watch Journey</span>
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group cursor-default">
                            <stat.icon className="w-6 h-6 text-brand-red/40 group-hover:text-brand-red transition-all duration-500" />
                            <span className="text-3xl font-black text-white">{stat.value}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-white/30">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
