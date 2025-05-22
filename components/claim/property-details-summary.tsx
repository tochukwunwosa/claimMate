export function PropertyDetailsSummary({
  formData
}: {formData: ClaimFormData }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Property Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Description of Damage</p>
          <p>{formData.damageDescription || "Not specified"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Address of Loss</p>
          <p>{formData.addressOfLoss || "Not specified"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">City/State/Zip</p>
          <p>
            {[formData.city, formData.state, formData.zipCode].filter(Boolean).join(", ") || "Not specified"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Photos</p>
          <p>
            {formData.photos.length > 0 ? `${formData.photos.length} photos uploaded` : "No photos uploaded"}
          </p>
        </div>
      </div>
    </div>
  )
}
