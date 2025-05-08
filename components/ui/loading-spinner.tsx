import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  text?: string
  className?: string
}

export default function LoadingSpinner({ size = 8, text, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 size={size} className={`text-[#203F30] animate-spin`} />
      {text && <p className="text-[#1A1A1A] mt-2">{text}</p>}
    </div>
  )
}
