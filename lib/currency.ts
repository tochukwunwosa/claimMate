export interface Currency {
  code: string
  symbol: string
  name: string
  locale: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK" },
]

export interface ExchangeRates {
  [key: string]: number
}

// Get user's preferred currency based on their location
export function detectUserCurrency(): string {
  if (typeof window === "undefined") return "USD"

  try {
    // Try to get currency from Intl API
    const formatter = new Intl.NumberFormat()
    const options = formatter.resolvedOptions()

    // Map common locales to currencies
    const localeToCurrency: { [key: string]: string } = {
      "en-US": "USD",
      "en-GB": "GBP",
      "de-DE": "EUR",
      "fr-FR": "EUR",
      "es-ES": "EUR",
      "it-IT": "EUR",
      "nl-NL": "EUR",
      "en-CA": "CAD",
      "en-AU": "AUD",
      "ja-JP": "JPY",
      "de-CH": "CHF",
      "sv-SE": "SEK",
      "nb-NO": "NOK",
      "da-DK": "DKK",
    }

    const locale = options.locale || navigator.language
    return localeToCurrency[locale] || "USD"
  } catch {
    return "USD"
  }
}

// Format price according to currency and locale
export function formatCurrencyPrice(amount: number, currencyCode: string, locale?: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode)
  const formatLocale = locale || currency?.locale || "en-US"

  try {
    return new Intl.NumberFormat(formatLocale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: currencyCode === "JPY" ? 0 : 2,
      maximumFractionDigits: currencyCode === "JPY" ? 0 : 2,
    }).format(amount)
  } catch {
    // Fallback formatting
    const symbol = currency?.symbol || currencyCode
    return `${symbol}${amount.toFixed(currencyCode === "JPY" ? 0 : 2)}`
  }
}

// Convert price from USD to target currency
export function convertPrice(usdAmount: number, targetCurrency: string, exchangeRates: ExchangeRates): number {
  if (targetCurrency === "USD") return usdAmount

  const rate = exchangeRates[targetCurrency]
  if (!rate) return usdAmount

  return usdAmount * rate
}

// Fetch exchange rates from API
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Using a free exchange rate API (you might want to use a paid service for production)
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
    const data = await response.json()

    return data.rates || {}
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error)

    // Fallback rates (you should update these regularly)
    return {
      EUR: 0.85,
      GBP: 0.73,
      CAD: 1.25,
      AUD: 1.35,
      JPY: 110,
      CHF: 0.92,
      SEK: 8.5,
      NOK: 8.8,
      DKK: 6.3,
    }
  }
}
