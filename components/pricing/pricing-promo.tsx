"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export function PricingPromo() {
  const [promoCode, setPromoCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code")
      return
    }

    setIsApplying(true)
    const supabase = createClient()

    try {
      // Check if promo code exists and is valid
      const { data: promoData, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !promoData) {
        toast.error("Invalid promo code. Please try again.")
        return
      }

      // Check if promo code has expired
      if (promoData.valid_until && new Date(promoData.valid_until) < new Date()) {
        toast.error("This promo code has expired.")
        return
      }

      // Check if promo code has reached max uses
      if (promoData.max_uses !== null && promoData.used_count >= promoData.max_uses) {
        toast.error("This promo code has reached its maximum uses.")
        return
      }

      // Calculate discount
      const discountText = promoData.discount_type === 'percentage'
        ? `${promoData.discount_value}%`
        : `$${(promoData.discount_value / 100).toFixed(2)}`

      // Store the promo code in session storage for checkout
      sessionStorage.setItem('activePromoCode', promoData.code)
      sessionStorage.setItem('promoDiscount', JSON.stringify({
        type: promoData.discount_type,
        value: promoData.discount_value
      }))

      toast.success(`Promo code applied! ${discountText} discount added.`)

      // Increment the used count
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({ used_count: promoData.used_count + 1 })
        .eq('id', promoData.id)

      if (updateError) {
        console.error('Error updating promo code usage:', updateError)
      }

    } catch (err) {
      console.error('Error applying promo code:', err)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-4 border rounded-lg bg-muted/50">
      <h4 className="text-sm font-medium mb-2">Have a promo code?</h4>
      <div className="flex gap-2">
        <Input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter promo code"
          className="bg-background"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleApplyPromo()
            }
          }}
        />
        <Button
          onClick={handleApplyPromo}
          disabled={isApplying}
          variant="outline"
          className="min-w-[80px]"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Enter code to get instant discounts on your subscription
      </p>
    </div>
  )
}
