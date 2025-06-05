"use client";

import { useRouter } from "next/navigation";

export function useClaimNavigation() {
  const router = useRouter();

  const handleCreateClaim = () => {
    router.push("/dashboard/claims/new")
  }

  const handleGenerateDraft = (claimId: string) => {
    router.push(`/dashboard/claims/${claimId}/draft`);
  };

  const handleViewDraft = (claimId: string) => {
    router.push(`/dashboard/claims/${claimId}/draft`);
  };

  const handleEditClaim = (claimId: string) => {
    router.push(`/dashboard/claims/${claimId}/edit`);
  }

  return { handleCreateClaim, handleEditClaim, handleGenerateDraft, handleViewDraft };
}
