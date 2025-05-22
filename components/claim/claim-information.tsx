import { Separator } from "@/components/ui/separator"
import React from "react"
import { formatClaimDate } from "@/lib/utils"

export function ClaimInformation({ claim }: { claim: Claim }) {
  return (
    <div>
      <h3 className="text-lg font-medium">Claim Information</h3>
      <Separator className="my-2" />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Claim Type</dt>
        <dd>{claim.claim_type}</dd>
        <dt className="text-muted-foreground">Client Name</dt>
        <dd>{claim.client_name}</dd>
        <dt className="text-muted-foreground">Carrier Name</dt>
        <dd>{claim.carrier_name}</dd>
        <dt className="text-muted-foreground">Policy Number</dt>
        <dd>{claim.policy_number}</dd>
        <dt className="text-muted-foreground">Loss Date</dt>
        <dd>{formatClaimDate(claim.created_at)}
        </dd>
      </dl>
    </div>
  )
}
