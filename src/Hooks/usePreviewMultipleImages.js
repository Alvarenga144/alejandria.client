import React, { useState } from 'react';
import Compressor from 'compressorjs';

const usePreviewMultipleImages = () => {
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith("image/"));

        if (validFiles.length > 0) {
            const newImages = validFiles.map(file => {
                const reader = new FileReader();
                new Compressor(file, {
                    quality: 0.6,
                    retainExif: false,
                    checkOrientation: false,
                    success: (result) => {
                        reader.readAsDataURL(result);
                    },
                });

                return new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                });
            });

            Promise.all(newImages)
                .then(images => setImages(prevImages => [...prevImages, ...images].slice(0, 6)))
                .catch(error => alert("Error loading images: " + error));
        } else {
            alert("Invalid file type. Please select image files.");
        }
    };
    
    return { handleImageChange, images, setImages };
};

export { usePreviewMultipleImages as default };
