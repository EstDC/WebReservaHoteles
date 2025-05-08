import React, { useEffect, useState } from 'react';
import cloudinary from '../config/cloudinary';

const CloudinaryVideo = ({ publicId, className, controls = true, autoPlay = false, loop = false, muted = false }) => {
  const [signedUrl, setSignedUrl] = useState('');

  useEffect(() => {
    const generateSignedUrl = async () => {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
          {
            timestamp: timestamp,
            public_id: publicId,
          },
          import.meta.env.CLOUDINARY_API_SECRET
        );

        const url = `https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/video/upload/v${timestamp}/${publicId}?signature=${signature}&api_key=${import.meta.env.CLOUDINARY_API_KEY}`;
        setSignedUrl(url);
      } catch (error) {
        console.error('Error generating signed URL:', error);
      }
    };

    generateSignedUrl();
  }, [publicId]);

  if (!signedUrl) return null;

  return (
    <video
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
    >
      <source src={signedUrl} type="video/mp4" />
      Tu navegador no soporta el elemento de video.
    </video>
  );
};

export default CloudinaryVideo; 