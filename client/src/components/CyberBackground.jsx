import React, { useEffect, useRef } from 'react';

const CyberBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const characters = '01';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above screen with random delays
        }

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px "Space Grotesk", monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random text
                const text = characters.charAt(Math.floor(Math.random() * characters.length));

                // Color logic
                const isBright = Math.random() > 0.98;
                ctx.fillStyle = isBright ? '#ffffff' : '#00FF41'; // Bright white highlight or Matrix Green

                // Draw text
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop or move down
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60 z-0"
        />
    );
};

export default CyberBackground;