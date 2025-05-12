import { useEffect, useRef } from 'react';

const YouTubeBackground = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Cargar la API de YouTube
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Inicializar el player cuando la API esté lista
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-background', {
        videoId: 'Za5giay17vQ',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div id="youtube-background" className="w-full h-full" />
    </div>
  );
};

export default YouTubeBackground; 