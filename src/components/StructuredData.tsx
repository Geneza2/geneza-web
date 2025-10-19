import React from 'react'

type StructuredDataProps = {
  type: 'organization' | 'product' | 'jobPosting' | 'breadcrumb'
  data: Record<string, unknown>
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateSchema = (): Record<string, unknown> | null => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://geneza.rs'

    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: (data.name as string) || 'Geneza',
          description:
            (data.description as string) || 'Leading provider of quality products and services',
          url: baseUrl,
          logo: `${baseUrl}/logo-color.svg`,
          sameAs: [
            (data.socialMedia as Record<string, string>)?.facebook,
            (data.socialMedia as Record<string, string>)?.instagram,
            (data.socialMedia as Record<string, string>)?.linkedin,
          ].filter(Boolean),
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: (data.phone as string) || '+381 11 123 4567',
            contactType: 'customer service',
            email: (data.email as string) || 'info@geneza.rs',
            areaServed: 'RS',
            availableLanguage: ['Serbian', 'English'],
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: (data.address as Record<string, string>)?.street,
            addressLocality: (data.address as Record<string, string>)?.city,
            addressCountry: 'RS',
          },
        }

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.title as string,
          description:
            (data.description as string) || (data.meta as Record<string, string>)?.description,
          image: (data.image as Record<string, string>)?.url
            ? `${baseUrl}${(data.image as Record<string, string>).url}`
            : undefined,
          brand: {
            '@type': 'Brand',
            name: 'Geneza',
          },
          offers: data.price
            ? {
                '@type': 'Offer',
                price: data.price as string,
                priceCurrency: 'RSD',
                availability: 'https://schema.org/InStock',
              }
            : undefined,
        }

      case 'jobPosting':
        return {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: (data.position as string) || (data.title as string),
          description:
            (data.description as string) || (data.meta as Record<string, string>)?.description,
          datePosted: (data.createdAt as string) || new Date().toISOString(),
          validThrough: data.validThrough as string,
          employmentType: (data.employmentType as string) || 'FULL_TIME',
          hiringOrganization: {
            '@type': 'Organization',
            name: 'Geneza',
            sameAs: baseUrl,
            logo: `${baseUrl}/logo-color.svg`,
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'RS',
              addressLocality: (data.location as string) || 'Serbia',
            },
          },
          baseSalary: data.salary
            ? {
                '@type': 'MonetaryAmount',
                currency: 'RSD',
                value: {
                  '@type': 'QuantitativeValue',
                  value: data.salary as string,
                  unitText: 'MONTH',
                },
              }
            : undefined,
        }

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement:
            (data.items as Array<{ name: string; url: string }>)?.map((item, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: `${baseUrl}${item.url}`,
            })) || [],
        }

      default:
        return null
    }
  }

  const schema = generateSchema()

  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
