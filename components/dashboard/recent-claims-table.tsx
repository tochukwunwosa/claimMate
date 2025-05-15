"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Claim {
  id: string
  title: string
  type: string
  dateCreated: string
  status: "Draft" | "Submitted"
}

const claims: Claim[] = [
  {
    id: "1",
    title: "Claim Title A",
    type: "Auto",
    dateCreated: "04/16/2024",
    status: "Draft",
  },
  {
    id: "2",
    title: "Claim Title B",
    type: "Medical",
    dateCreated: "04/14/2024",
    status: "Submitted",
  },
  {
    id: "3",
    title: "Claim Title C",
    type: "Auto",
    dateCreated: "04/10/2024",
    status: "Submitted",
  },
]

export function RecentClaimsTable() {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Claims</CardTitle>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim Title</TableHead>
              <TableHead>Claim Type</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.title}</TableCell>
                <TableCell>{claim.type}</TableCell>
                <TableCell>{claim.dateCreated}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      claim.status === "Draft"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
