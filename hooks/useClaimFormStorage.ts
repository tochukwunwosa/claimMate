import { useState, useEffect } from 'react';

const STORAGE_KEY = 'claimmate_form_data';

export function useClaimFormStorage(initialData?: ClaimFormData) {
  const [formData, setFormData] = useState<ClaimFormData>(() => {
    if (typeof window === 'undefined') return initialData || {} as ClaimFormData;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If we have initialData (editing mode), prefer that over saved data
        return initialData || parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved form data:', e);
    }
    
    return initialData || {} as ClaimFormData;
  });

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = (data: Partial<ClaimFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({} as ClaimFormData);
  };

  return {
    formData,
    updateFormData,
    clearFormData
  };
} 