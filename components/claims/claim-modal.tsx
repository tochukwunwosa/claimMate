import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { formatClaimDate } from "@/lib/utils"
interface ClaimModalProps { 
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  claim: Claim | null
}

export default function ClaimModal({ isViewModalOpen, setIsViewModalOpen, claim }: ClaimModalProps) {
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className={`${index > 0 ? 'mt-4' : ''} whitespace-pre-wrap`}>
        {paragraph}
      </p>
    ))
  }
  return (
    < Dialog open = { isViewModalOpen } onOpenChange = { setIsViewModalOpen } >
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{claim?.claim_title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {claim?.generated_content ? (
            formatContent(claim.generated_content)
          ) : (
            <p className="text-muted-foreground">No content generated yet.</p>
          )}
        </div>
      <DialogFooter>
          Created at: {formatClaimDate(claim?.created_at)}
      </DialogFooter>
      </DialogContent>
      </Dialog >
  )
}

