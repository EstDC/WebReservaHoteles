/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {'user' | 'admin'} role
 */

/**
 * @typedef {Object} Hotel
 * @property {number} id
 * @property {string} name
 * @property {string} location
 * @property {number} price
 * @property {number} rating
 * @property {string} image
 * @property {string} description
 * @property {string[]} amenities
 * @property {Room[]} rooms
 */

/**
 * @typedef {Object} Room
 * @property {number} id
 * @property {string} type
 * @property {number} price
 * @property {number} capacity
 * @property {number} available
 * @property {string} description
 * @property {string[]} images
 */

/**
 * @typedef {Object} Booking
 * @property {number} id
 * @property {number} hotelId
 * @property {number} roomId
 * @property {number} userId
 * @property {string} checkIn
 * @property {string} checkOut
 * @property {number} guests
 * @property {number} totalPrice
 * @property {'pending' | 'confirmed' | 'cancelled'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [location]
 * @property {string} [checkIn]
 * @property {string} [checkOut]
 * @property {number} [guests]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 * @property {number} [rating]
 * @property {string[]} [amenities]
 */

// Exportamos los tipos para que estén disponibles globalmente
export const types = {
  User: /** @type {User} */ ({}),
  Hotel: /** @type {Hotel} */ ({}),
  Room: /** @type {Room} */ ({}),
  Booking: /** @type {Booking} */ ({}),
  SearchFilters: /** @type {SearchFilters} */ ({})
}; 