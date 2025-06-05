-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS promo_code_uses CASCADE;

-- Create plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  monthly_price INTEGER NOT NULL, -- in cents
  yearly_price INTEGER NOT NULL, -- in cents
  features JSONB NOT NULL DEFAULT '[]',
  limitations JSONB DEFAULT '[]',
  max_users INTEGER NOT NULL DEFAULT 1,
  max_claims INTEGER, -- null means unlimited
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'expired', 'cancelled', 'past_due')),
  is_trial BOOLEAN DEFAULT false,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  payment_required BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  notified_3_days BOOLEAN DEFAULT false,
  notified_1_day BOOLEAN DEFAULT false,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One subscription per user
);

-- Create promo_codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL, -- percentage or amount in cents
  max_uses INTEGER, -- null means unlimited
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  min_purchase_amount INTEGER, -- minimum purchase amount in cents
  applicable_plans TEXT[], -- array of plan IDs this code can be used with
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo_code_uses table
CREATE TABLE promo_code_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id),
  user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial pricing plans
INSERT INTO plans (name, description, monthly_price, yearly_price, features, max_claims, is_popular, sort_order) VALUES
(
  'Starter',
  'Perfect for independent adjusters getting started',
  2900, -- $29/month
  2417, -- $29 * 0.8333 = $24.17/month when paid yearly
  '[
    "Up to 50 claims/month",
    "Basic templates",
    "Email support",
    "Export to PDF",
    "7-day trial"
  ]'::jsonb,
  50,
  false,
  1
),
(
  'Professional',
  'For growing insurance practices',
  4900, -- $49/month
  4083, -- $49 * 0.8333 = $40.83/month when paid yearly
  '[
    "Unlimited claims",
    "Advanced templates",
    "Priority support",
    "Team collaboration (up to 3 users)",
    "Custom branding",
    "Export to PDF & Word",
    "API access",
    "7-day trial"
  ]'::jsonb,
  null,
  true,
  2
),
(
  'Enterprise',
  'Custom solutions for large teams',
  99900, -- $999/month
  83250, -- $999 * 0.8333 = $832.50/month when paid yearly
  '[
    "Everything in Professional",
    "Unlimited team members",
    "Custom templates",
    "Dedicated account manager",
    "Custom integration support",
    "SLA guarantee",
    "Training sessions",
    "Custom contract terms"
  ]'::jsonb,
  null,
  false,
  3
);

-- Insert sample promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, max_uses, valid_until) VALUES
(
  'LAUNCH30',
  'Launch special - 30% off first 3 months',
  'percentage',
  30,
  100,
  NOW() + INTERVAL '30 days'
),
(
  'YEARLY20',
  '20% off yearly plans',
  'percentage',
  20,
  null,
  NOW() + INTERVAL '90 days'
);

-- Create indexes for better performance
CREATE INDEX idx_plans_active ON plans(is_active);
CREATE INDEX idx_plans_sort_order ON plans(sort_order);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end) WHERE is_trial = true;
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans (public read access)
CREATE POLICY "Plans are viewable by everyone" 
ON plans FOR SELECT 
USING (is_active = true);

-- RLS Policies for subscriptions (users can only see their own)
CREATE POLICY "Users can view their own subscription" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON subscriptions FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check if a user has feature access
CREATE OR REPLACE FUNCTION user_has_feature_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  subscription_record subscriptions%ROWTYPE;
BEGIN
  -- Get user's subscription
  SELECT * INTO subscription_record
  FROM subscriptions
  WHERE user_id = user_uuid;
  
  -- If no subscription, no access
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If trial and not expired, has access
  IF subscription_record.is_trial AND subscription_record.trial_end > NOW() THEN
    RETURN TRUE;
  END IF;
  
  -- If active subscription, has access
  IF subscription_record.status = 'active' THEN
    RETURN TRUE;
  END IF;
  
  -- Otherwise, no access
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trial days remaining
CREATE OR REPLACE FUNCTION get_trial_days_remaining(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  subscription_record subscriptions%ROWTYPE;
  days_remaining INTEGER;
BEGIN
  -- Get user's subscription
  SELECT * INTO subscription_record
  FROM subscriptions
  WHERE user_id = user_uuid AND is_trial = true;
  
  -- If no trial subscription, return 0
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Calculate days remaining
  days_remaining := EXTRACT(DAY FROM (subscription_record.trial_end - NOW()));
  
  -- Return 0 if negative
  RETURN GREATEST(0, days_remaining);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for easy subscription data with plan details
CREATE OR REPLACE VIEW user_subscription_details AS
SELECT 
  s.*,
  p.name as plan_name,
  p.description as plan_description,
  p.monthly_price,
  p.yearly_price,
  p.features,
  p.limitations,
  p.max_users,
  p.max_claims,
  p.is_popular,
  user_has_feature_access(s.user_id) as has_access,
  CASE 
    WHEN s.is_trial THEN get_trial_days_remaining(s.user_id)
    ELSE 0
  END as trial_days_remaining
FROM subscriptions s
LEFT JOIN plans p ON s.plan_id = p.id;

-- Grant access to the view
GRANT SELECT ON user_subscription_details TO authenticated;

-- Sample data for testing (optional - remove in production)
-- This creates a test subscription for development
-- INSERT INTO subscriptions (user_id, plan_id, status, is_trial, trial_start, trial_end)
-- SELECT 
--   auth.uid(),
--   (SELECT id FROM plans WHERE name = 'Pro'),
--   'trialing',
--   true,
--   NOW(),
--   NOW() + INTERVAL '7 days'
-- WHERE auth.uid() IS NOT NULL;
