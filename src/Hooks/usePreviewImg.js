import React, { useState } from 'react';
import Compressor from 'compressorjs';

const usePreviewImg = (defaultImgUrl) => {
    const [imgUrl, setImgUrl] = useState(defaultImgUrl);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImgUrl(reader.result);
            };

            new Compressor(file, {
                quality: 0.6,
                retainExif: false,
                success: (result) => {
                  reader.readAsDataURL(result);
                },
            });
            
        } else {
            alert("Invalid file type. Please select an image file.");
            setImgUrl(defaultImgUrl);
        }
    };
    return { handleImageChange, imgUrl, setImgUrl };
};

export { usePreviewImg as default };
