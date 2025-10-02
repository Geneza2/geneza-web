/**
 * Normalizes search queries by converting special characters to their base forms
 * This allows searching for "sargarepa" to match "šargarepa" and vice versa
 */

const characterMap: Record<string, string> = {
  // Serbian/Croatian characters
  š: 's',
  Š: 'S',
  ć: 'c',
  Ć: 'C',
  č: 'c',
  Č: 'C',
  ž: 'z',
  Ž: 'Z',
  đ: 'd',
  Đ: 'D',
  nj: 'n',
  Nj: 'N',
  NJ: 'N',
  lj: 'l',
  Lj: 'L',
  LJ: 'L',
  dž: 'd',
  Dž: 'D',
  DŽ: 'D',

  // Other common special characters
  ä: 'a',
  Ä: 'A',
  ö: 'o',
  Ö: 'O',
  ü: 'u',
  Ü: 'U',
  ß: 'ss',
  æ: 'ae',
  Æ: 'AE',
  ø: 'o',
  Ø: 'O',
  å: 'a',
  Å: 'A',
  é: 'e',
  É: 'E',
  è: 'e',
  È: 'E',
  ê: 'e',
  Ê: 'E',
  ë: 'e',
  Ë: 'E',
  á: 'a',
  Á: 'A',
  à: 'a',
  À: 'A',
  â: 'a',
  Â: 'A',
  ã: 'a',
  Ã: 'A',
  í: 'i',
  Í: 'I',
  ì: 'i',
  Ì: 'I',
  î: 'i',
  Î: 'I',
  ï: 'i',
  Ï: 'I',
  ó: 'o',
  Ó: 'O',
  ò: 'o',
  Ò: 'O',
  ô: 'o',
  Ô: 'O',
  õ: 'o',
  Õ: 'O',
  ú: 'u',
  Ú: 'U',
  ù: 'u',
  Ù: 'U',
  û: 'u',
  Û: 'U',
  ý: 'y',
  Ý: 'Y',
  ÿ: 'y',
  Ÿ: 'Y',
  ñ: 'n',
  Ñ: 'N',
  ç: 'c',
  Ç: 'C',
}

// Common misspellings and variations for Serbian/Croatian
const commonVariations: Record<string, string[]> = {
  peršun: ['persun', 'peršun', 'peršun', 'peršun'],
  šargarepa: ['sargarepa', 'šargarepa', 'sargarepa', 'šargarepa'],
  krompir: ['krompir', 'krompir', 'krompir'],
  spanać: ['spanac', 'spanać', 'spanac', 'spanać'],
  kukuruz: ['kukuruz', 'kukuruz'],
  boranija: ['boranija', 'boranija'],
  paškanat: ['paskanat', 'paškanat', 'paskanat', 'paškanat'],
  grašak: ['grasak', 'grašak', 'grasak', 'grašak'],
  ječam: ['jecam', 'ječam', 'jecam', 'ječam'],
  sargarepa: ['šargarepa', 'sargarepa', 'šargarepa', 'sargarepa'],
  persun: ['peršun', 'persun', 'peršun', 'persun'],
  spanac: ['spanać', 'spanac', 'spanać', 'spanac'],
  paskanat: ['paškanat', 'paskanat', 'paškanat', 'paskanat'],
  jecam: ['ječam', 'jecam', 'ječam', 'jecam'],
}

/**
 * Normalizes a search query by converting special characters to their base forms
 * @param query - The search query to normalize
 * @returns The normalized query with special characters converted to base forms
 */
export function normalizeSearchQuery(query: string): string {
  if (!query) return ''

  let normalized = query.toLowerCase().trim()

  // Handle multi-character replacements first (like 'nj', 'lj', 'dž')
  normalized = normalized.replace(/dž/g, 'd')
  normalized = normalized.replace(/nj/g, 'n')
  normalized = normalized.replace(/lj/g, 'l')

  // Handle single character replacements
  for (const [special, base] of Object.entries(characterMap)) {
    normalized = normalized.replace(new RegExp(special, 'g'), base)
  }

  return normalized
}

/**
 * Gets all possible search variations for a query
 * @param query - The search query
 * @returns Array of all possible variations to search for
 */
export function getSearchVariations(query: string): string[] {
  if (!query) return []

  const variations = new Set<string>()
  const lowerQuery = query.toLowerCase().trim()

  // Add original query
  variations.add(lowerQuery)

  // Add normalized version
  const normalized = normalizeSearchQuery(query)
  variations.add(normalized)

  // Add common variations
  for (const [key, variants] of Object.entries(commonVariations)) {
    if (key === lowerQuery || normalized === key) {
      variants.forEach((variant) => variations.add(variant))
    }
    // Also check if any variant matches our query
    if (variants.includes(lowerQuery)) {
      variants.forEach((variant) => variations.add(variant))
    }
  }

  // Add character-by-character variations
  const charVariations = generateCharacterVariations(lowerQuery)
  charVariations.forEach((variation) => variations.add(variation))

  return Array.from(variations).filter((v) => v.length > 0)
}

/**
 * Generates character variations for fuzzy matching
 * @param query - The query to generate variations for
 * @returns Array of character variations
 */
function generateCharacterVariations(query: string): string[] {
  const variations = new Set<string>()

  // Add version with all special characters normalized
  variations.add(normalizeSearchQuery(query))

  // Add version with special characters added back
  let withSpecials = query
  for (const [special, base] of Object.entries(characterMap)) {
    withSpecials = withSpecials.replace(new RegExp(base, 'g'), special)
  }
  variations.add(withSpecials)

  // Add partial matches for better fuzzy matching
  if (query.length > 3) {
    // Add substring variations
    for (let i = 0; i <= query.length - 3; i++) {
      const substring = query.substring(i, query.length)
      if (substring.length >= 3) {
        variations.add(substring)
        variations.add(normalizeSearchQuery(substring))
      }
    }
  }

  return Array.from(variations)
}

/**
 * Creates an advanced fuzzy search condition with multiple strategies
 * @param field - The field to search in
 * @param query - The search query
 * @returns A Payload search condition object
 */
export function createFuzzySearchCondition(field: string, query: string) {
  const variations = getSearchVariations(query)
  const conditions: Array<{
    [key: string]: { equals?: string; contains?: string; like?: string }
  }> = []

  // Add exact matches (highest priority)
  variations.forEach((variation) => {
    conditions.push({ [field]: { equals: variation } })
    conditions.push({ [field]: { contains: variation } })
  })

  // Add case-insensitive matches
  variations.forEach((variation) => {
    conditions.push({ [field]: { like: `%${variation}%` } })
  })

  // Add partial word matches for longer queries
  if (query.length > 4) {
    const words = query.split(/\s+/)
    words.forEach((word) => {
      if (word.length > 2) {
        const wordVariations = getSearchVariations(word)
        wordVariations.forEach((variation) => {
          conditions.push({ [field]: { contains: variation } })
        })
      }
    })
  }

  return {
    or: conditions,
  }
}

/**
 * Creates a search condition that matches both original and normalized versions
 * @param field - The field to search in
 * @param query - The search query
 * @returns A Payload search condition object
 */
export function createElasticSearchCondition(field: string, query: string) {
  const variations = getSearchVariations(query)

  // Remove duplicates and filter out empty strings
  const uniqueVariations = [...new Set(variations)].filter((v) => v.length > 0)

  // If only one variation, search normally
  if (uniqueVariations.length === 1) {
    return { [field]: { contains: uniqueVariations[0] } }
  }

  // Search for all variations
  const conditions = uniqueVariations.map((variation) => ({
    [field]: { contains: variation },
  }))

  return {
    or: conditions,
  }
}
