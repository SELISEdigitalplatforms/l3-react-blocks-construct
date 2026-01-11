import { clients } from '@/lib/https';
import {
  GetPreSignedUrlForUploadPayload,
  GetPreSignedUrlForUploadResponse,
} from '../types/storage.types';

export const getPreSignedUrlForUpload = async (
  payload: GetPreSignedUrlForUploadPayload
): Promise<GetPreSignedUrlForUploadResponse> => {
  const response = await clients.post<GetPreSignedUrlForUploadResponse>(
    '/uds/v1/Files/GetPreSignedUrlForUpload',
    JSON.stringify(payload)
  );
  return response;
};
