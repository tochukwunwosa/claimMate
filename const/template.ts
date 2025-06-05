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
      Claim Type: {claim_type}
      Carrier Name: {carrier_name}
      Client Name: {client_name}
      Policy Number: {policy_number}
      Loss Date: {loss_date}
      Address of Loss: {address_of_loss}, {city}, {state} {zip_code}
      
      Damage Description: {damage_description}
      
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
      Client Name: {client_name}
      Claim Type: {claim_type}
      Carrier Name: {carrier_name}
      Policy Number: {policy_number}
      Loss Date: {loss_date}
      Address of Loss: {address_of_loss}, {city}, {state} {zip_code}
      Damage Description: {damage_description}
      
      The letter should:
      - Be dated {current_date}
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
      Claim Type: {claim_type}
      Carrier Name: {carrier_name}
      Client Name: {client_name}
      Policy Number: {policy_number}
      Loss Date: {loss_date}
      Address of Loss: {address_of_loss}, {city}, {state} {zip_code}
      Damage Description: {damage_description}
      
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
