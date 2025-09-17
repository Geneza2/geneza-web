'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/ui'

import { Mail, Phone, User, Package, Send, Scissors } from 'lucide-react'

type CutSize = {
  id?: string | null
  name: string
}

interface ProductOrderFormProps {
  productTitle: string
  locale: string
  cutSizes?: CutSize[]
}

export const ProductOrderForm: React.FC<ProductOrderFormProps> = ({
  productTitle,
  locale,
  cutSizes = [],
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    cutSize: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        quantity: '',
        cutSize: '',
        message: '',
      })
    }, 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCutSizeChange = (cutSizeId: string) => {
    setFormData((prev) => ({ ...prev, cutSize: cutSizeId }))
  }

  const texts = {
    en: {
      title: 'Request Sample',
      subtitle: 'Get in touch with us to request a sample or place an order',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company Name',
      quantity: 'Quantity (if applicable)',
      cutSize: 'Cut Size',
      cutSizePlaceholder: 'Select cut size',
      message: 'Additional Message',
      messagePlaceholder: 'Tell us more about your requirements...',
      submit: 'Send Request',
      submitting: 'Sending...',
      success: 'Request sent successfully!',
      successMessage: 'We will contact you within 24 hours.',
    },
    rs: {
      title: 'Zatražite Uzorak',
      subtitle: 'Kontaktirajte nas za uzorak ili porudžbinu',
      name: 'Ime i Prezime',
      email: 'Email Adresa',
      phone: 'Broj Telefona',
      company: 'Naziv Kompanije',
      quantity: 'Količina (ako je primenljivo)',
      cutSize: 'Veličina Reza',
      cutSizePlaceholder: 'Izaberite veličinu reza',
      message: 'Dodatna Poruka',
      messagePlaceholder: 'Recite nam više o vašim potrebama...',
      submit: 'Pošaljite Zahtev',
      submitting: 'Šaljem...',
      success: 'Zahtev je uspešno poslat!',
      successMessage: 'Kontaktiraćemo vas u roku od 24 sata.',
    },
  }

  const t = texts[locale as keyof typeof texts] || texts.en

  if (isSubmitted) {
    return (
      <Card className="bg-white border-primary/20 rounded-xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{t.success}</h3>
          <p className="text-primary/80">{t.successMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-gray-200 rounded-xl">
      <CardHeader className="bg-gray-50 border-b rounded-t-xl">
        <CardTitle className="flex items-center text-xl text-gray-900">
          <Package className="w-6 h-6 mr-3 text-gray-600" />
          {t.title}
        </CardTitle>
        <p className="text-gray-600 mt-2">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" />
                {t.name} *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2" />
                {t.email} *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                {t.phone}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center text-gray-700">
                <Package className="w-4 h-4 mr-2" />
                {t.company}
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center text-gray-700">
                <Package className="w-4 h-4 mr-2" />
                {t.quantity}
              </Label>
              <Input
                id="quantity"
                type="text"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className="rounded-xl"
                placeholder="e.g., 500kg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <Scissors className="w-4 h-4 mr-2" />
                {t.cutSize}
              </Label>
              <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                {cutSizes.map((cut: CutSize, i: number) => {
                  const cutId = cut.id || `${cut.name}-${i}`
                  const isSelected = formData.cutSize === cutId
                  return (
                    <button
                      key={cutId}
                      type="button"
                      onClick={() => handleCutSizeChange(cutId)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm transition-all hover:scale-105',
                        isSelected
                          ? 'text-white border-transparent'
                          : 'text-gray-600 border-gray-300 hover:border-gray-400',
                      )}
                      style={isSelected ? { backgroundColor: '#9BC273' } : {}}
                    >
                      {cut.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              {t.message}
            </Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t.messagePlaceholder}
              className="rounded-xl"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              <strong>{locale === 'rs' ? 'Proizvod:' : 'Product:'}</strong> {productTitle}
            </p>
            {formData.cutSize && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>{locale === 'rs' ? 'Veličina Reza:' : 'Cut Size:'}</strong>{' '}
                {
                  cutSizes.find(
                    (s: CutSize, i: number) => (s.id || `${s.name}-${i}`) === formData.cutSize,
                  )?.name
                }
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-lg font-medium rounded-xl"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {t.submitting}
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t.submit}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
