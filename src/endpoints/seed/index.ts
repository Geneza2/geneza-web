import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'products',
  'forms',
  'form-submissions',
  'search',
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),

    // Create categories for goods
    payload.create({
      collection: 'categories',
      data: {
        title: 'Fresh Produce',
        description: 'Fresh fruits and vegetables',
      },
      locale: 'en',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Fresh Produce',
        description: 'Sveže voće i povrće',
      },
      locale: 'rs',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Dairy Products',
        description: 'Milk, cheese, and dairy items',
      },
      locale: 'en',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Dairy Products',
        description: 'Mlečni proizvodi',
      },
      locale: 'rs',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Meat & Poultry',
        description: 'Fresh meat and poultry products',
      },
      locale: 'en',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Meat & Poultry',
        description: 'Meso i živina',
      },
      locale: 'rs',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Bakery',
        description: 'Fresh bread and baked goods',
      },
      locale: 'en',
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Bakery',
        description: 'Pekara',
      },
      locale: 'rs',
    }),
  ])

  payload.logger.info(`— Seeding products...`)

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Goods',
              url: '/goods',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    // Create footer with localized content
    await Promise.all([
      // English footer
      payload.updateGlobal({
        slug: 'footer',
        data: {
          branding: {
            missionStatement:
              'Our vision is to provide convenience and help increase your sales business.',
            socialMedia: {
              facebook: 'https://facebook.com/geneza',
              instagram: 'https://instagram.com/geneza',
              linkedin: 'https://linkedin.com/company/geneza',
              tiktok: 'https://tiktok.com/@geneza',
            },
          },
          sitemapSections: [
            {
              title: 'Products',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'All Products',
                    url: '/products',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'New Arrivals',
                    url: '/products?new=true',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Featured',
                    url: '/products?featured=true',
                  },
                },
              ],
            },
            {
              title: 'Goods',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'All Goods',
                    url: '/goods',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Fresh Produce',
                    url: '/goods?category=fresh-produce',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Dairy Products',
                    url: '/goods?category=dairy-products',
                  },
                },
              ],
            },
            {
              title: 'Services',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Consulting',
                    url: '/services/consulting',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Support',
                    url: '/services/support',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Training',
                    url: '/services/training',
                  },
                },
              ],
            },
            {
              title: 'About',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Our Story',
                    url: '/about',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Team',
                    url: '/about/team',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Contact',
                    url: '/contact',
                  },
                },
              ],
            },
          ],
          contactInfo: {
            email: 'geneza@geneza.com',
            phone: '+381 24 4874 987',
            address: '24420 Kanjiža, Srbija Put Narodnih heroja 17',
          },
          copyright: '©2025 Geneza. All rights reserved.',
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Privacy Policy',
                url: '/privacy',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Terms of Service',
                url: '/terms',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Admin',
                url: '/admin',
              },
            },
          ],
        },
        locale: 'en',
      }),

      // Serbian footer
      payload.updateGlobal({
        slug: 'footer',
        data: {
          branding: {
            missionStatement:
              'Naša vizija je da pružimo praktičnost i pomognemo da povećate vaš poslovni promet.',
            socialMedia: {
              facebook: 'https://facebook.com/geneza',
              instagram: 'https://instagram.com/geneza',
              linkedin: 'https://linkedin.com/company/geneza',
              tiktok: 'https://tiktok.com/@geneza',
            },
          },
          sitemapSections: [
            {
              title: 'Proizvodi',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Svi proizvodi',
                    url: '/products',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Nove kolekcije',
                    url: '/products?new=true',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Izdvojeno',
                    url: '/products?featured=true',
                  },
                },
              ],
            },
            {
              title: 'Roba',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Sva roba',
                    url: '/goods',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Sveže voće i povrće',
                    url: '/goods?category=fresh-produce',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Mlečni proizvodi',
                    url: '/goods?category=dairy-products',
                  },
                },
              ],
            },
            {
              title: 'Usluge',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Konsalting',
                    url: '/services/consulting',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Podrška',
                    url: '/services/support',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Obučavanje',
                    url: '/services/training',
                  },
                },
              ],
            },
            {
              title: 'O nama',
              links: [
                {
                  link: {
                    type: 'custom',
                    label: 'Naša priča',
                    url: '/about',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Tim',
                    url: '/about/team',
                  },
                },
                {
                  link: {
                    type: 'custom',
                    label: 'Kontakt',
                    url: '/contact',
                  },
                },
              ],
            },
          ],
          contactInfo: {
            email: 'geneza@geneza.com',
            phone: '+381 24 4874 987',
            address: '24420 Kanjiža, Srbija Put Narodnih heroja 17',
          },
          copyright: '©2025 Geneza. Sva prava zadržana.',
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Politika privatnosti',
                url: '/privacy',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Uslovi korišćenja',
                url: '/terms',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Admin',
                url: '/admin',
              },
            },
          ],
        },
        locale: 'rs',
      }),
    ]),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
