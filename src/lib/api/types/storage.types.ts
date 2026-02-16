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
  moduleName: number;
};

export type GetPreSignedUrlForUploadResponse = {
  errors?: Record<string, string>;
  isSuccess: boolean;
  uploadUrl?: string;
  fileId?: string;
};
