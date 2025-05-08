import { Suspense } from "react"
import VerificationContent from "./verification-content"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function VerificationPage() {
  return (
    <div className="min-h-screen pt-10 px-4 flex items-center justify-center">
      <Suspense fallback={<LoadingSpinner size={24} />}>
        <VerificationContent />
      </Suspense>
    </div>
  )
}
