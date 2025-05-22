
export function ClaimInformationSummary({
  formData
}: { formData: ClaimFormData }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Claim Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Claim Type</p>
          <p>{formData.claimType || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Client Name</p>
          <p>{formData.clientName || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Carrier Name</p>
          <p>{formData.carrierName || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Policy Number</p>
          <p>{formData.policyNumber || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Loss Date</p>
          <p>{formData.lossDate || "Not specified"}</p>
        </div>
      </div>
    </div>
  )
}
