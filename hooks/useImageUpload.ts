import { useState } from 'react';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';

export const useImageUpload = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info && typeof result.info !== "string") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = result.info.secure_url;
      img.onload = () => {
        setImage(img);
        setDimensions({ width: 800, height: 800 }); // Set fixed canvas size
      };
    }
  };

  return { image, dimensions, handleImageUpload };
};
