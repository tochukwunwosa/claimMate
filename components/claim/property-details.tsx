import { Separator } from "@/components/ui/separator"
import React from "react"

export function PropertyDetails({ claim }: { claim: Claim }) {
  return (
    <div>
      <h3 className="text-lg font-medium">Property Details</h3>
      <Separator className="my-2" />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Address</dt>
        <dd>{claim.address_of_loss}</dd>
        <dt className="text-muted-foreground">City</dt>
        <dd>{claim.city}</dd>
        <dt className="text-muted-foreground">State</dt>
        <dd>{claim.state}</dd>
        <dt className="text-muted-foreground">Zip Code</dt>
        <dd>{claim.zip_code}</dd>
      </dl>
    </div>
  )
}
