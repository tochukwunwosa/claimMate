import { XCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
  children?: React.ReactNode
}

export function FormError({ message, children }: FormErrorProps) {
  const errorMessage = message || children

  if (!errorMessage) return null

  return (
    <div className="flex items-center gap-2 text-destructive text-sm mt-1">
      <XCircle className="w-4 h-4" />
      <span>{errorMessage}</span>
    </div>
  )
} 