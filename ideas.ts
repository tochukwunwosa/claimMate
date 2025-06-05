// const aiPrompt = `
// Claim Type: ${formData.claim_type}
// Carrier: ${formData.carrier_name}
// Policy #: ${formData.policy_number}
// Loss Date: ${formData.loss_date}
// Description: ${formData.damage_description}
// Address: ${formData.address_of_loss}, ${formData.city}, ${formData.state} ${formData.zip_code}
// Notes: ${formData.internal_notes}

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