'use client'

import React from 'react'
import Image from 'next/image'

const SerbiaMap: React.FC = () => {
  return (
    <div className="w-screen h-64 relative -mx-4 sm:-mx-6 lg:-mx-12">
      {/* Background Image - Full Width */}
      <Image
        src="/footer_bg.jpg"
        alt="Serbia and Europe Map"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
    </div>
  )
}

export default SerbiaMap
