export default function VocabularyCard({ word, onClick, isBookmarked, onToggleBookmark }) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  }

  const badgeColor = difficultyColors[word.difficulty] || 'bg-gray-100 text-gray-700'

  // Handle both string and array synonyms/antonyms
  const synonymText = Array.isArray(word.synonym) 
    ? word.synonym.join(', ') 
    : word.synonym || 'None'
  
  const antonymText = Array.isArray(word.antonym) 
    ? word.antonym.join(', ') 
    : word.antonym || 'None'

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleBookmark(word.id)
        }}
        className="absolute top-4 right-4 text-2xl hover:scale-110 transition"
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? '🔖' : '📑'}
      </button>

      <div onClick={onClick} className="cursor-pointer">
        <div className="flex justify-between items-center mb-4 pr-8">
          <h2 className="text-2xl font-bold text-purple-700">
            {word.word}
          </h2>

          <div className="flex gap-2">
            <span className={`${badgeColor} px-3 py-1 rounded-full text-sm font-semibold`}>
              {word.difficulty}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              {word.category}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">
          {word.meaning}
        </p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Example:</span>{' '}
            {word.example}
          </p>

          <p>
            <span className="font-semibold">Synonym:</span>{' '}
            {synonymText}
          </p>

          <p>
            <span className="font-semibold">Antonym:</span>{' '}
            {antonymText}
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">Click to expand</p>
      </div>
    </div>
  )
}