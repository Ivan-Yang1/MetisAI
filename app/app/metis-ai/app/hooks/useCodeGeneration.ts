import { useState } from 'react';
import { CodeGenerationRequest, CodeGenerationResponse, CodeGenerationTask } from '@/app/types';

export const useCodeGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (request: CodeGenerationRequest): Promise<CodeGenerationResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify(request),
      });

      const data: CodeGenerationResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Code generation failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Code generation failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateCode,
  };
};
