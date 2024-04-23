'use client'
import z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { Billboard } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'

const formSchema = z.object({
  label: z.string().min(3),
  imageUrl: z.string().min(1),
})

type BillboardFormValue = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null
}
export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoagin] = useState(false)
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const toasMessage = initialData ? 'Bilboard updated.' : 'Billboard created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<BillboardFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: '', imageUrl: '' },
  })

  const onSubmit = async (data: BillboardFormValue) => {
    try {
      setLoagin(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data,
        )
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }

      router.refresh()
      toast({ title: toasMessage })
    } catch (error) {
      toast({
        title: `Something went wrong`,
        variant: 'destructive',
      })
    } finally {
      setLoagin(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoagin(true)
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      )
      router.refresh()
      router.push('/')
      toast({
        title: `Billboard deleted`,
      })
    } catch (error) {
      toast({
        title: `Make sure you removed all categories using this billboard first`,
        variant: 'destructive',
      })
    } finally {
      setLoagin(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className=" flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className="size-5" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>imageUrl</FormLabel>
                <FormControl>
                  <ImageUpload
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                    disabled={loading}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Billboard label"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="ml-auto" disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
