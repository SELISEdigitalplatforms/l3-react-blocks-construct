import { useGlobalMutation } from '@/state/query-client/hooks';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { getPreSignedUrlForUpload } from '../services/storage.service';
import {
  GetPreSignedUrlForUploadPayload,
  GetPreSignedUrlForUploadResponse,
} from '../types/storage.types';

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
