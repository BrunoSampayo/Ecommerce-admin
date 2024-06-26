'use client'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Store } from '@prisma/client'
import { useStoreModal } from '@/hooks/use-store-modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwithcerProps extends PopoverTriggerProps {
  items: Store[]
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwithcerProps) {
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const formatedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currenStore = formatedItems.find(
    (item) => item.value === params.storeId,
  )

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currenStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store ..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formatedItems.map((store) => (
                <CommandItem
                  value={store.label}
                  key={store.value}
                  onSelect={() => {
                    onStoreSelect(store)
                  }}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 size-4" />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto size-4',
                      currenStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className="size-5 mr-2" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
