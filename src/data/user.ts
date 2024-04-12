'use server'

import { auth } from '@clerk/nextjs'

export const getUserId = () => {
  const { userId } = auth()

  if (!userId) return null
  return userId
}
