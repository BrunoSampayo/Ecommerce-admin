import { getUserId } from '@/data/user'
import prismadb from '@/lib/prismadb'
import { redirect } from 'next/navigation'

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = getUserId()
  if (!userId) redirect('/sign-in')

  const store = await prismadb.store.findFirst({
    where: { userId },
  })
  if (store) redirect(`/${store.id}`)

  return <>{children}</>
}
