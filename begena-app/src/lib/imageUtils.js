/**
 * Utility for client-side image compression and conversion
 */
export const compressImage = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) => {
    return new Promise((resolve) => {
        if (!file || !(file instanceof Blob)) {
            resolve({ blob: file, dataUrl: '' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl !== 'string') {
                resolve({ blob: file, dataUrl: '' });
                return;
            }

            const img = new Image();
            img.onload = () => {
                let width = img.naturalWidth || img.width;
                let height = img.naturalHeight || img.height;

                if (!width || !height) {
                    resolve({ blob: file, dataUrl });
                    return;
                }

                // Scale down proportionally if larger than maximum dimensions
                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    resolve({ blob: file, dataUrl });
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
                            resolve({ blob, dataUrl: optimizedDataUrl });
                        } else {
                            resolve({ blob: file, dataUrl });
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => {
                resolve({ blob: file, dataUrl });
            };

            img.src = dataUrl;
        };

        reader.onerror = () => {
            resolve({ blob: file, dataUrl: '' });
        };

        reader.readAsDataURL(file);
    });
};
