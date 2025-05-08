import { useState } from 'react'
import { useHotelStore } from '../../stores/hotelStore.js'
import { useTranslation } from 'react-i18next'

export const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('')
  const { setSearchQuery } = useHotelStore()
  const { t } = useTranslation()

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localQuery)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={t('hotel.searchPlaceholder')}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {t('common.search')}
      </button>
    </form>
  )
} 