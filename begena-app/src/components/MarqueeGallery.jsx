import { motion } from 'framer-motion';

import img1 from '../assets/gallery-1.jpg';
import img2 from '../assets/gallery-2.jpg';
import img3 from '../assets/gallery-3.jpg';
import img4 from '../assets/gallery-4.jpg';
import img5 from '../assets/gallery-5.jpg';

const images = [img1, img2, img3, img4, img5];

const MarqueeGallery = () => {
    return (
        <section className="relative py-24 bg-dark-950 overflow-hidden flex flex-col items-center justify-center">
            {/* Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[400px] bg-brand-red/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="relative w-full max-w-[100vw] overflow-hidden py-10" style={{ perspective: '1200px' }}>
                {/* 3D Container */}
                <div className="flex w-max animate-marquee-3d" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Double the images for seamless looping */}
                    {[...images, ...images].map((src, index) => (
                        <div
                            key={index}
                            className="relative shrink-0 w-[280px] md:w-[350px] h-[350px] md:h-[450px] mx-4 lg:mx-6 rounded-4xl overflow-hidden bg-dark-900 border border-white/10 shadow-[0_0_40px_rgba(152,28,0,0.2)] group transform transition-all duration-700 hover:scale-105 hover:shadow-[0_0_80px_rgba(152,28,0,0.5)] hover:-translate-y-6 hover:border-brand-red/50 hover:z-50"
                        >
                            <img
                                src={src}
                                alt={`Gallery ${index}`}
                                className="w-full h-full object-cover rounded-4xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Edge fades for seamless entrance/exit */}
            <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 bg-linear-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 bg-linear-to-l from-dark-950 to-transparent z-10 pointer-events-none" />
        </section>
    );
};

export default MarqueeGallery;
