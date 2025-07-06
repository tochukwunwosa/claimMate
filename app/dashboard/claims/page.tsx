"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Search, FileText, Eye, Filter, ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusBadge, getClaimTypeLabel, formatClaimDate } from "@/lib/utils"
import { getClaims } from '@/action/claim'
import { deleteClaim } from '@/action/claim'
import { useClaimNavigation } from "@/hooks/useClaimNavigation"
import ClaimModal from "@/components/claims/claim-modal"
import { RefreshButton } from "@/components/ui/refresh-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"




export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const { handleCreateClaim } = useClaimNavigation()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim)
    setIsViewModalOpen(true)
  }

  const loadClaims = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getClaims({ statusFilter, sortBy })

      if (!res.success) {
        toast.error(res.message || 'Failed to load claims')
        return
      }

      setClaims(res.data)
    } catch {
      toast.error('Failed to load claims')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, sortBy])

  useEffect(() => {
    loadClaims()
  }, [loadClaims])

  // Filter claims based on search query
  const filteredClaims = claims.filter((claim) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      (claim.client_name && claim.client_name.toLowerCase().includes(searchLower)) ||
      (claim.carrier_name && claim.carrier_name.toLowerCase().includes(searchLower)) ||
      (claim.policy_number && claim.policy_number.toLowerCase().includes(searchLower)) ||
      (claim.id && claim.id.toString().includes(searchLower))
    )
  })

  // delete claim
  const handleDeleteClaim = async (claimId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this claim?");
    if (!confirmDelete) return;

    try {
      const { success, message } = await deleteClaim(claimId);

      if (!success) {
        toast.error("Failed to delete claim.");
        return;
      }

      // Update UI
      setClaims((prev) => prev.filter((claim) => claim.id !== claimId));
      toast.success(message);
    } catch {
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:items-center md:justify-between mb-6">
        <DashboardHeader heading="Claims Management" text="View and manage all your insurance claims" />
        <Button onClick={handleCreateClaim} className="gap-2 w-fit">
          <Plus className="h-4 w-4" /> Create New Claim
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Claims</CardTitle>
          <div className="flex items-center">
            <CardDescription>
              You have {claims.length} total claim{claims.length !== 1 ? "s" : ""}
            </CardDescription>

            {/* refresh button */}
            <RefreshButton onClick={loadClaims} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search claims..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="max-w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-w-[180px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="client_az">Client (A-Z)</SelectItem>
                    <SelectItem value="client_za">Client (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No claims found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? "No claims match your search criteria. Try a different search term."
                  : "You haven't created any claims yet. Get started by creating a new claim."}
              </p>
              <Button onClick={handleCreateClaim} className="mt-6">
                <Plus className="mr-2 h-4 w-4" /> Create New Claim
              </Button>
            </div>
          ) : (
                <div className="w-full overflow-x-auto sm:overflow-visible lg:overflow-hidden">
                  <div className="">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Status</TableHead>
                          {/* <TableHead>Draft</TableHead> */}
                          <TableHead >Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClaims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell className="font-medium">{claim.client_name || "N/A"}</TableCell>
                            <TableCell>{getClaimTypeLabel(claim.claim_type)}</TableCell>
                            <TableCell>{formatClaimDate(claim.created_at)}</TableCell>
                            <TableCell>{getStatusBadge(claim.status ?? "unknown")}</TableCell>
                            {/* <TableCell>
                              {claim.generated_content ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                  Not Generated
                                </Badge>
                              )}
                            </TableCell> */}
                            <TableCell className="w-[1%] whitespace-nowrap text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewClaim(claim)}>
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  {/* {claim.generated_content ? (
                                    <DropdownMenuItem onClick={() => handleEditClaim(claim.id)}>
                                      <FileText className="h-3.5 w-3.5 mr-2" />
                                      Edit Draft
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleGenerateDraft(claim.id)}>
                                      <FileText className="h-3.5 w-3.5 mr-2" />
                                      Generate Draft
                                    </DropdownMenuItem>
                                  )} */}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClaim(claim.id)}
                                    className="text-red-600 focus:bg-red-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

          )}
        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredClaims.length} of {claims.length} claims
          </p>
        </CardFooter>
      </Card>

      {/* View Modal */}
      <ClaimModal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        claim={selectedClaim}
      />
    </div>

  )
}
