import { getUserId } from '@/data/user'
import prismadb from '@/lib/prismadb'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
interface DashboarLayoutInterface {
  children: React.ReactNode
  params: { storeId: string }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboarLayoutInterface) {
  const userId = getUserId()

  if (!userId) redirect('/sign-in')

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) redirect('/')

  return (
    <main>
      <Navbar />
      {children}
    </main>
  )
}
