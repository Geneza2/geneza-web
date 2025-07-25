import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactBlock } from '@/payload-types'
import { Info, MailIcon, PhoneIcon, ChefHat } from 'lucide-react'

export const ContactComponent: React.FC<ContactBlock> = ({ title, companyInfo, contacts }) => {
  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">{title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {companyInfo && (
          <Card className="lg:row-span-2 order-2 lg:order-1">
            <CardHeader className="bg-slate-800 text-white rounded-t-xl">
              <CardTitle className="flex items-center text-lg">
                <Info className="w-5 h-5 mr-3" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {companyInfo.name && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Name:</h3>
                    <p className="text-sm">{companyInfo.name}</p>
                  </div>
                )}

                {companyInfo.address && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">Address:</h3>
                    <p className="text-sm">{companyInfo.address}</p>
                  </div>
                )}

                {companyInfo.tin && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      TIN (Tax payer ID):
                    </h3>
                    <p className="text-sm">{companyInfo.tin}</p>
                  </div>
                )}

                {companyInfo.identificationNo && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Identification no:
                    </h3>
                    <p className="text-sm">{companyInfo.identificationNo}</p>
                  </div>
                )}

                {companyInfo.registrationNo && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Registration no:
                    </h3>
                    <p className="text-sm">{companyInfo.registrationNo}</p>
                  </div>
                )}

                {companyInfo.industrialNo && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      Industrial no:
                    </h3>
                    <p className="text-sm">{companyInfo.industrialNo}</p>
                  </div>
                )}

                {companyInfo.vatId && (
                  <div className="border-b pb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                      VAT (Value-added tax ID):
                    </h3>
                    <p className="text-sm">{companyInfo.vatId}</p>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  {companyInfo.frontOffice && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                        Front Office:
                      </h3>
                      <p className="text-sm">{companyInfo.frontOffice}</p>
                    </div>
                  )}

                  {companyInfo.commercialDepartment && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                        Commercial Department:
                      </h3>
                      <p className="text-sm">{companyInfo.commercialDepartment}</p>
                    </div>
                  )}

                  {companyInfo.cell && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Cell:</h3>
                      <p className="text-sm">{companyInfo.cell}</p>
                    </div>
                  )}

                  {companyInfo.email && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">E-mail:</h3>
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="text-sm hover:underline transition-colors"
                        style={{ color: '#9BC273' }}
                      >
                        {companyInfo.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="lg:col-span-2 order-1 lg:order-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts?.map((contact) => (
            <Card key={contact.id} className="bg-white">
              <CardHeader className="pb-2">
                <div className="w-32 h-32 relative mx-auto">
                  {typeof contact.avatar === 'object' && contact.avatar.url ? (
                    <Image
                      src={contact.avatar.url}
                      alt={contact.avatar.alt || contact.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-full">
                      <ChefHat className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-xl font-bold">{contact.name}</h3>
                <p className="text-muted-foreground">{contact.position}</p>
                <div className="mt-4 space-y-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 text-sm hover:underline"
                  >
                    <MailIcon className="w-4 h-4" />
                    {contact.email}
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-2 text-sm hover:underline"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {contact.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
