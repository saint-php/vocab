const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function fetchWordDefinition(word) {
  try {
    const response = await fetch(`${BASE_URL}/${word.toLowerCase()}`)
    
    if (!response.ok) {
      throw new Error('Word not found')
    }
    
    const data = await response.json()
    
    // Extract useful information from API response
    const entry = data[0]
    const meaning = entry.meanings[0]
    const definition = meaning.definitions[0]
    
    return {
      word: entry.word,
      meaning: definition.definition,
      example: definition.example || `The word "${entry.word}" is commonly used in English.`,
      phonetic: entry.phonetic || '',
      audio: entry.phonetics?.find(p => p.audio)?.audio || '',
      partOfSpeech: meaning.partOfSpeech,
      synonyms: definition.synonyms?.slice(0, 3) || [],
      antonyms: definition.antonyms?.slice(0, 3) || [],
    }
  } catch (error) {
    return null
  }
}

export async function fetchMultipleWords(words) {
  const results = []
  for (const word of words) {
    const definition = await fetchWordDefinition(word)
    if (definition) {
      results.push(definition)
    }
  }
  return results
}