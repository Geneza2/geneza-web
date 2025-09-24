'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL = getClientSideURL()

  // Ensure we have a valid server URL
  if (!serverURL) {
    console.warn('LivePreviewListener: No server URL available')
    return null
  }

  return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />
}
