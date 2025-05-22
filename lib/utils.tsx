'use client'
import React from 'react'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge"

type ClaimStatus = "draft" | "submitted" | "approved" | "rejected" | string;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// Helper function to get status badge color
export const getStatusBadge = (status: ClaimStatus) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>
    case "submitted":
      return <Badge className="bg-blue-500">Submitted</Badge>
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// Helper function to get a readable label for claim type
export const getClaimTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    water: "Water Damage",
    fire: "Fire Damage",
    wind: "Wind Damage",
    theft: "Theft",
    other: "Other",
  }
  return types[type] || type
}

// format date
export const formatClaimDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : "N/A"




