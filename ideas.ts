// const aiPrompt = `
// Claim Type: ${formData.claimType}
// Carrier: ${formData.carrierName}
// Policy #: ${formData.policyNumber}
// Loss Date: ${formData.lossDate}
// Description: ${formData.damageDescription}
// Address: ${formData.addressOfLoss}, ${formData.city}, ${formData.state} ${formData.zipCode}
// Notes: ${formData.internalNotes}

// Generate a formal insurance claim draft based on the details above.
// `;

// // Send to OpenRouter or API route
// const response = await fetch("/api/claims/generate-claim", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     prompt: aiPrompt,
//     model: "gpt-3.5-turbo",
//   }),
// });