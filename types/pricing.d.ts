declare interface Plan {
  id: string;
  name: string;
  description: string;
  monthly_price: number; // in cents
  yearly_price: number; // in cents
  features: string[];
  limitations: string[];
  max_users: number;
  max_claims: number | null;
  is_popular: boolean;
  sort_order: number;
}

declare interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "trialing" | "active" | "expired" | "cancelled" | "past_due";
  is_trial: boolean;
  trial_start: string | null;
  trial_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  payment_required: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  notified_3_days: boolean;
  notified_1_day: boolean;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  // From joined plan data
  plan_name?: string;
  plan_description?: string;
  monthly_price?: number;
  yearly_price?: number;
  features?: string[];
  limitations?: string[];
  max_users?: number;
  max_claims?: number | null;
  is_popular?: boolean;
  has_access?: boolean;
  trial_days_remaining?: number;
}