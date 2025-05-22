import { Separator } from "@/components/ui/separator"
import React from "react"

export function DamageNotes({ claim }: { claim: Claim }) {
  if (!claim.description && !claim.notes && !claim.instructions) return null

  return (
    <>
      {claim.description && (
        <div>
          <h3 className="text-lg font-medium">Damage Description</h3>
          <Separator className="my-2" />
          <p className="text-sm whitespace-pre-wrap">{claim.description}</p>
        </div>
      )}
      {(claim.notes || claim.instructions) && (
        <div>
          <h3 className="text-lg font-medium">Notes</h3>
          <Separator className="my-2" />
          {claim.notes && (
            <div className="mb-2">
              <p className="text-sm font-medium text-muted-foreground">Internal Notes</p>
              <p className="text-sm">{claim.notes}</p>
            </div>
          )}
          {claim.instructions && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Special Instructions</p>
              <p className="text-sm">{claim.instructions}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
