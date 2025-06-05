"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { detectUserCurrency, fetchExchangeRates, type ExchangeRates } from "@/lib/currency"

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  exchangeRates: ExchangeRates
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Detect user's preferred currency
    const detectedCurrency = detectUserCurrency()
    setCurrency(detectedCurrency)

    // Fetch exchange rates
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates()
        setExchangeRates(rates)
      } catch (error) {
        console.error("Failed to load exchange rates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExchangeRates()
  }, [])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
