import type { APIRoute } from 'astro';

interface Reserva {
  id: number;
  habitacion: {
    hotel: {
      nombre: string;
      descripcion: string;
    };
    tipo: string;
    descripcion: string;
  };
  fechaEntrada: string;
  fechaSalida: string;
  precioTotal: number;
  estado: string;
  fechaCreacion: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Se requiere el ID del usuario' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Por ahora, devolvemos un array vacío ya que no hay reservas
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error en el endpoint de bookings:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 