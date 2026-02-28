import { useEffect, useRef } from 'react';

const features = [
    {
        icon: '🎵',
        title: 'Spiritual Foundations',
        description: 'Learn the spiritual meaning and history of Begena — the instrument King David played for meditation and praise.',
    },
    {
        icon: '🎼',
        title: 'Practical Playing Skills',
        description: 'Master tuning, plucking techniques, finger positioning, and traditional melodies from expert instructors.',
    },
    {
        icon: '📖',
        title: 'Traditional Songs',
        description: 'Learn Dawit mezmurs, ancient Ethiopian spiritual compositions, and sacred hymns passed down through generations.',
    },
    {
        icon: '🎥',
        title: 'Recorded Lessons',
        description: 'Access replayable HD training videos and structured practice materials you can review anytime, anywhere.',
    },
];

const About = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = sectionRef.current?.querySelectorAll('.fade-in-up');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="relative py-24 md:py-32 px-6">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
            <div className="absolute top-40 right-0 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-brown-600/5 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 fade-in-up">
                    <span className="inline-block px-4 py-1.5 glass rounded-full text-gold-400 text-xs font-semibold tracking-widest uppercase mb-5">
                        Why Choose Us
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-brown-50">Why Learn Begena </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 italic">
                            With Us?
                        </span>
                    </h2>
                    <p className="text-brown-300 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        We blend centuries-old tradition with modern teaching methods. Our program is designed
                        to guide you on a spiritual and musical journey, connecting you to Ethiopia&apos;s rich heritage.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="fade-in-up glass rounded-2xl p-7 group hover:-translate-y-2 transition-all duration-500 hover:shadow-lg hover:shadow-gold-600/10"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="font-heading text-xl font-semibold text-gold-400 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-brown-300 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                            {/* Decorative line */}
                            <div className="mt-5 w-12 h-0.5 bg-gradient-to-r from-gold-500 to-transparent rounded-full group-hover:w-full transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
