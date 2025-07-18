import { useGlobalMutation } from 'state/query-client/hooks';
import {
  getPreSignedUrlForUpload,
  GetPreSignedUrlForUploadPayload,
  GetPreSignedUrlForUploadResponse,
} from '../services/storage.service';
import { useErrorHandler } from 'hooks/use-error-handler';

export const useGetPreSignedUrlForUpload = () => {
  const { handleError } = useErrorHandler();

  return useGlobalMutation<
    GetPreSignedUrlForUploadResponse,
    Error,
    GetPreSignedUrlForUploadPayload
  >({
    mutationKey: ['getPreSignedUrlForUpload'],
    mutationFn: getPreSignedUrlForUpload,
    onError: (error) => {
      handleError(error, {
        variant: 'destructive',
      });
    },
  });
};
