
export function NotesSummary({formData}: { formData: ClaimFormData }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Notes</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Internal Notes</p>
          <p>{formData.internalNotes || "None"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Special Instructions</p>
          <p>{formData.specialInstructions || "None"}</p>
        </div>
      </div>
    </div>
  )
}
