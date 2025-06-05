'use client'
import React from 'react'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X } from 'lucide-react';

type ClaimStatus = "draft" | "submitted" | "approved" | "rejected" | string;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PasswordRequirement = ({ text, met }: { text: string; met: boolean }) => {
  return (
    <li className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={met ? "text-emerald-500" : "text-muted-foreground"}>
        {text}
      </span>
    </li>
  )
}


// Helper function to get status badge color
export const getStatusBadge = (status: ClaimStatus) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>
    case "submitted":
      return <Badge className="bg-blue-500">Submitted</Badge>
    case "exported":
      return <Badge className="bg-green-500">Exported</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

// Helper function to get a readable label for claim type
export const getClaimTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    auto: "Auto",
    property: "Property",
    health: "Health",
    theft: "Theft",
    fire: "Fire",
    other: "Other",
  }
  return types[type] || type
}

// format date
export const formatClaimDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString() : "N/A"






