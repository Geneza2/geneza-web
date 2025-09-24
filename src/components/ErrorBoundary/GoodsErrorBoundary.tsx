'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'

interface Props {
  children: React.ReactNode
  locale?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class GoodsErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GoodsErrorBoundary caught an error:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      const { locale = 'en' } = this.props

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
          <div className="relative bg-gradient-to-br from-[#9BC273] via-[#8AB162] to-[#7BA050] overflow-hidden h-64 sm:h-80 lg:h-96">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                    <Package className="w-10 h-10 text-white" />
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    {locale === 'rs' ? 'Proizvodi' : 'Goods'}
                  </h1>

                  <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                    {locale === 'rs'
                      ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
                      : 'Discover our wide range of quality products directly from the source'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -mt-16 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl flex items-center justify-center">
                    <Package className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {locale === 'rs' ? 'Greška pri učitavanju' : 'Error loading goods'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'rs' ? 'Pokušajte ponovo kasnije' : 'Please try again later'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-[#9BC273] text-white rounded-lg hover:bg-[#8AB162] transition-colors"
                  >
                    {locale === 'rs' ? 'Pokušaj ponovo' : 'Try Again'}
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
