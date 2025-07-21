import { clients } from 'lib/https';

export type GetPreSignedUrlForUploadPayload = {
  itemId?: string;
  metaData?: string;
  name: string;
  parentDirectoryId?: string;
  tags?: string;
  accessModifier?: string;
  configurationName?: string;
  projectKey: string;
  additionalProperties?: Record<string, string>;
};

export type GetPreSignedUrlForUploadResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
  uploadUrl?: string;
  fileId?: string;
};

export const getPreSignedUrlForUpload = async (
  payload: GetPreSignedUrlForUploadPayload
): Promise<GetPreSignedUrlForUploadResponse> => {
  const response = await clients.post<GetPreSignedUrlForUploadResponse>(
    '/storage/v1/Files/GetPreSignedUrlForUpload',
    JSON.stringify(payload)
  );
  return response;
};
