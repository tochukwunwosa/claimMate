import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">12</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Claims in Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">3</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">9</div>
        </CardContent>
      </Card>
    </div>
  )
}
