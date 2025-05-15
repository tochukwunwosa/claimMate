import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Lightbulb } from "lucide-react"

export function NotificationCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Complete your profile</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">New feature: Templates</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
