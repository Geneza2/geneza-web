import type { Payload } from 'payload'

export const seedCategories = async (payload: Payload): Promise<void> => {
  const { docs: existingCategories } = await payload.find({
    collection: 'categories',
    limit: 1,
  })

  if (existingCategories.length > 0) {
    console.log('Categories already exist, skipping seed...')
    return
  }

  console.log('Seeding categories...')

  // Create main categories for English
  const driedVegetablesEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Dried vegetables and herbs',
      description: 'High-quality dried vegetables and aromatic herbs processed in our facilities',
      slug: 'dried-vegetables-herbs',
      order: 1,
      featured: true,
    },
    locale: 'en',
  })

  // Create Serbian version
  await payload.update({
    collection: 'categories',
    id: driedVegetablesEn.id,
    data: {
      title: 'Sušeno povrće i začinsko bilje',
      description: 'Visokokvalitetno sušeno povrće i aromatično bilje prerađeno u našim pogonima',
    },
    locale: 'rs',
  })

  const spicesEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Spices',
      description: 'Premium spices sourced from the best regions worldwide',
      slug: 'spices',
      order: 2,
      featured: true,
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'categories',
    id: spicesEn.id,
    data: {
      title: 'Začini',
      description: 'Premijum začini iz najboljih regiona širom sveta',
    },
    locale: 'rs',
  })

  const jarsBottlesEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Jars and bottles - O-I',
      description: 'High-quality glass packaging solutions for food and beverages',
      slug: 'jars-bottles-oi',
      order: 3,
      featured: false,
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'categories',
    id: jarsBottlesEn.id,
    data: {
      title: 'Tegle i flaše - O-I',
      description: 'Visokokvalitetna staklena ambalaža za hranu i piće',
    },
    locale: 'rs',
  })

  // Create subcategories for Jars and bottles
  const saucesJarsEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Sauces & Preserves jars',
      description: 'Specialized jars for sauces, jams, and preserves',
      slug: 'sauces-preserves-jars',
      parent: jarsBottlesEn.id,
      order: 1,
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'categories',
    id: saucesJarsEn.id,
    data: {
      title: 'Tegle za sosove i džemove',
      description: 'Specijalizovane tegle za sosove, džemove i konzervaciju',
    },
    locale: 'rs',
  })

  // Create additional subcategories (simplified for brevity)
  const beveragesEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Wine Bottles',
      description: 'Premium wine bottles for all types of wines',
      slug: 'wine-bottles',
      parent: jarsBottlesEn.id,
      order: 2,
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'categories',
    id: beveragesEn.id,
    data: {
      title: 'Flaše za vino',
      description: 'Premijum flaše za vino svih tipova',
    },
    locale: 'rs',
  })

  const spiritsEn = await payload.create({
    collection: 'categories',
    data: {
      title: 'Spirits Bottles',
      description: 'Elegant bottles for spirits and liquors',
      slug: 'spirits-bottles',
      parent: jarsBottlesEn.id,
      order: 3,
    },
    locale: 'en',
  })

  await payload.update({
    collection: 'categories',
    id: spiritsEn.id,
    data: {
      title: 'Flaše za žestoka pića',
      description: 'Elegantne flaše za žestoka pića i likere',
    },
    locale: 'rs',
  })

  console.log('✅ Categories seeded successfully!')
}
