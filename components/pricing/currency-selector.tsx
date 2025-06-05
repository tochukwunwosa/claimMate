"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SUPPORTED_CURRENCIES } from "@/lib/currency"
import { useCurrency } from "@/providers/use-currency"

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  const currentCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentCurrency?.symbol} {currentCurrency?.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_CURRENCIES.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className="flex items-center justify-between"
          >
            <span>{curr.name}</span>
            <span className="text-muted-foreground">
              {curr.symbol} {curr.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
