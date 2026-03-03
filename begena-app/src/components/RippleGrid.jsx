import { useEffect, useRef } from 'react';

const RippleGrid = ({
    gridColor = '#981c00',
    rippleColor = '#ffffff',
    rippleIntensity = 25,
    gridSize = 60,
    gridThickness = 1,
    glowIntensity = 0.5,
    opacity = 0.3,
}) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY,
            };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = gridThickness;
            ctx.globalAlpha = opacity;

            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;

            // Ripple effect logic
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize;
                    const y = j * gridSize;

                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0, (200 - dist) / 200);
                    const ripple = force * rippleIntensity;

                    // Draw vertical line segment
                    if (j < rows - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        const nextY = (j + 1) * gridSize;
                        const midY = (y + nextY) / 2;

                        // Calculate ripple for midpoint too
                        const mdx = x - mouseRef.current.x;
                        const mdy = midY - mouseRef.current.y;
                        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                        const mforce = Math.max(0, (200 - mdist) / 200);
                        const mripple = mforce * rippleIntensity;

                        ctx.lineTo(x + mripple, nextY);
                        ctx.stroke();
                    }

                    // Draw horizontal line segment
                    if (i < cols - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        const nextX = (i + 1) * gridSize;
                        const midX = (x + nextX) / 2;

                        const mdx = midX - mouseRef.current.x;
                        const mdy = y - mouseRef.current.y;
                        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                        const mforce = Math.max(0, (200 - mdist) / 200);
                        const mripple = mforce * rippleIntensity;

                        ctx.lineTo(nextX, y + mripple);
                        ctx.stroke();
                    }

                    // Draw intersection glow
                    if (force > 0) {
                        ctx.save();
                        ctx.globalAlpha = force * glowIntensity;
                        ctx.fillStyle = rippleColor;
                        ctx.beginPath();
                        ctx.arc(x + ripple, y + ripple, 2, 0, Math.PI * 2);
                        ctx.fill();

                        // Add glow
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = rippleColor;
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gridColor, gridSize, gridThickness, rippleIntensity, glowIntensity, opacity, rippleColor]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ filter: 'contrast(1.2)' }}
        />
    );
};

export default RippleGrid;
