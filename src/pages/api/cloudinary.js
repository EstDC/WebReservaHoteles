import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dy4eis8h4',
  api_key: '642774869688681',
  api_secret: '3_o2mMnkHKd-Ys0DYZ9fp1pDp0w',
  secure: true
});

export async function GET({ url }) {
  const publicId = url.searchParams.get('publicId');
  
  if (!publicId) {
    return new Response(JSON.stringify({ error: 'publicId is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Transformaciones básicas para optimización
  const transformation = 'f_auto,q_auto';
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      public_id: publicId,
      transformation: transformation
    },
    '3_o2mMnkHKd-Ys0DYZ9fp1pDp0w'
  );

  // Construir URL con transformaciones
  const signedUrl = `https://res.cloudinary.com/dy4eis8h4/video/upload/${transformation}/v${timestamp}/${publicId}?signature=${signature}&api_key=642774869688681`;

  return new Response(JSON.stringify({ url: signedUrl }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 