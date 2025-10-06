'use client'

import React from 'react'
import Image from 'next/image'

const SerbiaMap: React.FC = () => {
  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg">
      <Image
        src="/footer_bg.jpg"
        alt="Serbia and Europe Map"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black bg-opacity-20" />
    </div>
  )
}

export default SerbiaMap
