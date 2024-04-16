'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Copy, Server } from 'lucide-react'

import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
interface ApiAlertProps {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
}
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = 'public',
}) => {
  const { toast } = useToast()
  const onCopy = () => {
    navigator.clipboard.writeText(description)
    toast({
      title: ` Api Route copied to the clipboard`,
      variant: 'success',
    })
  }
  return (
    <Alert>
      <Server className="size-4" />
      <AlertTitle className=" flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relativa rounder bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button size="icon" variant="outline" onClick={onCopy}>
          <Copy className="size-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
