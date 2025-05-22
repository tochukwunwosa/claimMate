interface TemplateOption {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
}

export const templates: TemplateOption[] = [
  {
    id: "detailed",
    name: "Detailed Report",
    description: "Comprehensive claim report with full details and analysis",
    promptTemplate: `Create a detailed professional insurance claim report using the following information:
      Claim Type: {claimType}
      Carrier Name: {carrierName}
      Client Name: {clientName}
      Policy Number: {policyNumber}
      Loss Date: {lossDate}
      Address of Loss: {addressOfLoss}, {city}, {state} {zipCode}
      
      Damage Description: {damageDescription}
      
      Format the report with these sections:
      1. CLAIM SUMMARY (brief overview)
      2. POLICY INFORMATION (details about policy and coverage)
      3. LOSS DETAILS (comprehensive description of the damage)
      4. DAMAGES ASSESSMENT (assessment of the damages, items affected)
      5. NEXT STEPS (recommendations and process timeline)
      
      Use formal language appropriate for an insurance document. Include claim number {id} in the header.
      Write in third person professional tone. Format with proper headings and spacing.`,
  },
  {
    id: "letter",
    name: "Client Letter",
    description: "Formal letter to the client explaining their claim status",
    promptTemplate: `Write a formal insurance claim letter to the client using the following information:
      Client Name: {clientName}
      Claim Type: {claimType}
      Carrier Name: {carrierName}
      Policy Number: {policyNumber}
      Loss Date: {lossDate}
      Address of Loss: {addressOfLoss}, {city}, {state} {zipCode}
      Damage Description: {damageDescription}
      
      The letter should:
      - Be dated {currentDate}
      - Have a proper business letter format with letterhead for the carrier
      - Acknowledge receipt of their claim
      - Reference policy coverage briefly
      - Outline next steps in the claims process
      - Provide contact information for questions
      - Be professional but empathetic in tone
      - Include claim number {id} as reference
      
      Include a signature block at the end.`,
  },
  {
    id: "summary",
    name: "Claim Summary",
    description: "Brief summary of claim details for quick reference",
    promptTemplate: `Create a concise insurance claim summary using the following information:
      Claim Type: {claimType}
      Carrier Name: {carrierName}
      Client Name: {clientName}
      Policy Number: {policyNumber}
      Loss Date: {lossDate}
      Address of Loss: {addressOfLoss}, {city}, {state} {zipCode}
      Damage Description: {damageDescription}
      
      Format as a one-page summary with bullet points under these headings:
      • CLAIM INFORMATION
      • POLICYHOLDER DETAILS
      • LOSS INFORMATION
      • DAMAGE SUMMARY
      • COVERAGE NOTES
      
      Keep language clear and direct, focusing only on key facts.
      Include claim number {id} at the top.`,
  },
];
