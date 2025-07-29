export function generatePositionSlug(positionName: string): string {
  return positionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Function to generate consistent English-based slugs
// This should be used when you want the same slug regardless of locale
export function generateEnglishPositionSlug(positionName: string): string {
  return generatePositionSlug(positionName)
}
