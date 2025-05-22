"use client";

import { useRouter } from "next/navigation";

export function useClaimNavigation() {
  const router = useRouter();

  const handleGenerateDraft = (claimId: string) => {
    router.push(`/dashboard/claims/${claimId}/draft`);
  };

  const handleViewDraft = (claimId: string) => {
    router.push(`/dashboard/claims/${claimId}/draft`);
  };

  // export const handleEditClaim = (claimId: string) => {
//     // This would navigate to an edit page
    
//     // toast.info("Edit functionality would be implemented here")
//   }

  return { handleGenerateDraft, handleViewDraft };
}
