import { useState } from 'react'
import { fetchWordDefinition } from '../services/dictionaryApi'

export default function DictionarySearch({ onAddWord }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    const definition = await fetchWordDefinition(searchTerm)
    
    if (definition) {
      setResult(definition)
    } else {
      setError(`"${searchTerm}" not found in dictionary. Try another word.`)
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-purple-700 mb-4">🔍 Dictionary Search</h2>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Type any English word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-purple-700">{result.word}</h3>
            {result.phonetic && (
              <span className="text-gray-500 text-sm">{result.phonetic}</span>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Meaning:</span> {result.meaning}
          </p>
          
          <p className="text-gray-600 italic mb-2">
            "{result.example}"
          </p>
          
          {result.synonyms.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Synonyms:</span> {result.synonyms.join(', ')}
            </p>
          )}
          
          {result.antonyms.length > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Antonyms:</span> {result.antonyms.join(', ')}
            </p>
          )}

          {result.audio && (
            <audio controls className="w-full mb-4">
              <source src={result.audio} type="audio/mpeg" />
              Your browser does not support audio.
            </audio>
          )}

          <button
            onClick={() => onAddWord(result)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition"
          >
            ➕ Add to My Words
          </button>
        </div>
      )}
    </div>
  )
}