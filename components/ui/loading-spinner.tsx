import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  text?: string
  className?: string
}

export default function LoadingSpinner({ size = 8, text, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 size={size} className={`text-primary animate-spin`} />
      {text && <p className="text-foreground mt-2">{text}</p>}
    </div>
  )
}
