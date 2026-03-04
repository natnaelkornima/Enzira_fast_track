import img1 from '../assets/gallery-1.jpg';
import img2 from '../assets/gallery-2.jpg';
import img3 from '../assets/gallery-3.jpg';
import img4 from '../assets/gallery-4.jpg';
import img5 from '../assets/gallery-5.jpg';

const images = [img1, img2, img3, img4, img5];

const MarqueeRow = ({ reverse = false, speed = '25s' }) => {
    const doubled = [...images, ...images, ...images];
    return (
        <div
            className="flex gap-4 w-max"
            style={{
                animation: `${reverse ? 'marquee-reverse' : 'marquee-forward'} ${speed} linear infinite`,
            }}
        >
            {doubled.map((src, i) => (
                <div
                    key={i}
                    className="shrink-0 w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(152,28,0,0.15)] group hover:shadow-[0_0_40px_rgba(152,28,0,0.4)] hover:border-brand-red/40 transition-all duration-500 hover:scale-110 hover:z-20 relative"
                >
                    <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark-950/60 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
                </div>
            ))}
        </div>
    );
};

const MarqueeGallery = () => {
    return (
        <section className="relative py-16 bg-dark-950 overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[300px] bg-brand-red/8 blur-[100px] pointer-events-none rounded-full" />

            {/* 3D Tilted Container */}
            <div
                className="relative mx-auto"
                style={{
                    perspective: '1200px',
                }}
            >
                <div
                    className="flex flex-col gap-4 py-8"
                    style={{
                        transform: 'rotateX(25deg) rotateZ(-8deg) scale(0.85)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <MarqueeRow speed="35s" />
                    <MarqueeRow reverse speed="30s" />
                    <MarqueeRow speed="40s" />
                    <MarqueeRow reverse speed="28s" />
                </div>
            </div>

            {/* Edge fades */}
            <div className="absolute top-0 bottom-0 left-0 w-32 md:w-64 bg-linear-to-r from-dark-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-32 md:w-64 bg-linear-to-l from-dark-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-dark-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-dark-950 to-transparent z-10 pointer-events-none" />
        </section>
    );
};

export default MarqueeGallery;
