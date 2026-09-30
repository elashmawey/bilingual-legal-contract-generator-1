import type { ContractFormData, GeneratedContract } from '../types';
import { getOfficialFallbackContract } from './officialEgyptianContracts';

export const generateContract = async (formData: ContractFormData): Promise<GeneratedContract> => {
  // Check if browser/device is currently offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.info('[ContractGenerator] Device is OFFLINE. Loading verified official statutory contract template.');
    const officialContract = getOfficialFallbackContract(formData);
    return officialContract;
  }

  try {
    const response = await fetch('/api/generate-contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error === 'RATE_LIMIT_EXCEEDED') {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      
      // If server error, fallback safely to official verified contract
      if (response.status >= 500) {
        console.warn('[ContractGenerator] Server returned 500, falling back to official statutory contract.');
        return getOfficialFallbackContract(formData);
      }

      throw new Error(errorData.message || errorData.error || 'Failed to generate contract from the API.');
    }

    const data: GeneratedContract = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error generating contract:', error);

    // If network failure or offline event, use the official verified Egyptian contracts engine
    if (
      !navigator.onLine ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('Network request failed')
    ) {
      console.info('[ContractGenerator] Network failure detected. Activating official offline Egyptian legal engine.');
      return getOfficialFallbackContract(formData);
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate contract from the API.');
  }
};
