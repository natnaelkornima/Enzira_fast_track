import { motion } from 'framer-motion';
import { Music, BookOpen, GraduationCap, PlayCircle, History } from 'lucide-react';

const features = [
    {
        icon: History,
        title: 'Spiritual Foundations',
        description: 'Learn the spiritual meaning and history of Begena — the instrument King David played for meditation and praise.',
    },
    {
        icon: GraduationCap,
        title: 'Practical Playing Skills',
        description: 'Master tuning, plucking techniques, finger positioning, and traditional melodies from expert instructors.',
    },
    {
        icon: Music,
        title: 'Traditional Songs',
        description: 'Learn Dawit mezmurs, ancient Ethiopian spiritual compositions, and sacred hymns passed down through generations.',
    },
    {
        icon: PlayCircle,
        title: 'Recorded Lessons',
        description: 'Access replayable HD training videos and structured practice materials you can review anytime, anywhere.',
    },
];

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="about" className="relative section-container overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-600/5 rounded-full blur-[100px] animate-glow" />

            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-5 py-1.5 glass rounded-full text-gold-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                        Excellence in Tradition
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
                        <span className="text-white">Why Learn Begena </span>
                        <span className="italic text-transparent bg-clip-text bg-linear-to-r from-gold-300 to-gold-600">
                            With Us?
                        </span>
                    </h2>
                    <p className="text-brown-100/50 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        We blend centuries-old tradition with modern teaching methods, guiding you on a spiritual and musical journey deep into Ethiopia&apos;s rich cultural heritage.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="glass-card group p-8 flex flex-col items-start relative overflow-hidden"
                            whileHover={{ y: -5 }}
                        >
                            {/* Icon with glow */}
                            <div className="relative mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold-500/50 group-hover:bg-gold-500/10 transition-all duration-500 shadow-xl">
                                    <feature.icon className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" strokeWidth={1.5} />
                                </div>
                                <div className="absolute inset-0 bg-gold-400/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                            </div>

                            <h3 className="font-heading text-xl font-bold text-white mb-4 group-hover:text-gold-300 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-brown-100/40 text-sm leading-relaxed font-light group-hover:text-brown-100/70 transition-colors">
                                {feature.description}
                            </p>

                            {/* Animated decorator */}
                            <div className="mt-8 w-12 h-[2px] bg-linear-to-r from-gold-500/50 to-transparent rounded-full group-hover:w-full group-hover:from-gold-400 group-hover:to-gold-600 transition-all duration-700" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
