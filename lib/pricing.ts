
/**
 * Format price from cents to dollars
 */
export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2);
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(
  monthlyPrice: number,
  yearlyPrice: number
): number {
  return monthlyPrice * 12 - yearlyPrice * 12;
}

/**
 * Get plan features as array (handles both string[] and JSONB)
 */
export function getPlanFeatures(plan: Plan): string[] {
  if (Array.isArray(plan.features)) {
    return plan.features;
  }
  // Handle JSONB from database
  return plan.features || [];
}

/**
 * Get plan limitations as array (handles both string[] and JSONB)
 */
export function getPlanLimitations(plan: Plan): string[] {
  if (Array.isArray(plan.limitations)) {
    return plan.limitations;
  }
  // Handle JSONB from database
  return plan.limitations || [];
}

/**
 * Check if a plan allows unlimited claims
 */
export function hasUnlimitedClaims(plan: Plan): boolean {
  return plan.max_claims === null;
}

/**
 * Get plan display price based on billing cycle
 */
export function getPlanPrice(plan: Plan, isYearly: boolean): number {
  return isYearly ? plan.yearly_price : plan.monthly_price;
}

/**
 * Calculate percentage savings for yearly billing
 */
export function getYearlySavingsPercentage(plan: Plan): number {
  const monthlyCost = plan.monthly_price * 12;
  const yearlyCost = plan.yearly_price * 12;
  const savings = monthlyCost - yearlyCost;
  return Math.round((savings / monthlyCost) * 100);
}
