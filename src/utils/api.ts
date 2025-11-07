import axios from 'axios';
import { SubmitPayload, JobResponse, ResultResponse } from '@/types/form';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const submitForm = async (data: SubmitPayload): Promise<string> => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await axios.post<JobResponse>(`${API_BASE_URL}/form`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.jobId;
};

export const retrieveResults = async (jobId: string): Promise<ResultResponse> => {
  const response = await axios.get<ResultResponse>(
    `${API_BASE_URL}/retrieve_results`,
    { params: { jobId } }
  );
  return response.data;
};

export const pollResults = async (
  jobId: string,
  onProgress?: (attempt: number) => void
): Promise<ResultResponse> => {
  const maxAttempts = 20;
  const pollInterval = 3000;
  const initialDelay = 10000;

  await new Promise(resolve => setTimeout(resolve, initialDelay));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    onProgress?.(attempt);
    
    const result = await retrieveResults(jobId);
    
    if (result.status === 'completed' || result.status === 'error') {
      return result;
    }

    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error('Timeout: Results not ready after 60 seconds');
};
