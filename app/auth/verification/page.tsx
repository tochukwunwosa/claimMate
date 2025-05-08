import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import VerificationContent from "./verification-content"

export default function VerificationPage() {
  return (
    <div className="min-h-screen pt-10 px-4 flex items-center justify-center">
      <Suspense fallback={<LoadingSpinner size={24} />}>
        <VerificationContent />
      </Suspense>
    </div>
  )
}
