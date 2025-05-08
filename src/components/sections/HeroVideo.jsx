import React from 'react';

const HeroVideo = () => {
  return (
    <div className="relative w-full h-full">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source 
          src="https://res.cloudinary.com/dy4eis8h4/video/upload/v1746518609/t8tdc3kbcixunl57nbwk.mp4" 
          type="video/mp4" 
        />
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
};

export default HeroVideo; 