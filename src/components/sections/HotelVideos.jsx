import React from 'react';

const HotelVideos = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
        <video
          className="w-full h-full object-cover"
          controls
          playsInline
        >
          <source 
            src="https://res.cloudinary.com/dy4eis8h4/video/upload/v1746518609/t8tdc3kbcixunl57nbwk.mp4" 
            type="video/mp4" 
          />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
        <video
          className="w-full h-full object-cover"
          controls
          playsInline
        >
          <source 
            src="https://res.cloudinary.com/dy4eis8h4/video/upload/v1746518603/ljkfdrgo9hd5e21zelpu.mp4" 
            type="video/mp4" 
          />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  );
};

export default HotelVideos; 