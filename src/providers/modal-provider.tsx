'use client'

import { useEffect, useState } from 'react'

import { StoreModal } from '@/components/modals/store-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  // To prevent hydratation error in server side
  if (!isMounted) return null

  return (
    <>
      <StoreModal />
    </>
  )
}
