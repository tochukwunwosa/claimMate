import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"


interface RefreshButtonProps {
  onClick: () => void
  className?: string
}

export function RefreshButton({ onClick, className }: RefreshButtonProps) {
  return <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick} className={cn("ml-auto", className)}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Refresh</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}
