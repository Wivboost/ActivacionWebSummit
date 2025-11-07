export interface FormData {
  productName: string;
  productVisual?: File;
  industry: string;
  imageStyle: string;
  problemStatement: string;
  tone: string;
  cta: string;
  userPhoto?: File;
  logoPhoto?: File;
}

export interface PersonalData {
  name: string;
  email: string;
  company?: string;
}

export interface SubmitPayload extends FormData, PersonalData {}

export interface JobResponse {
  jobId: string;
}

export interface ResultResponse {
  status: 'pending' | 'completed' | 'error';
  imageUrl?: string;
  error?: string;
}
