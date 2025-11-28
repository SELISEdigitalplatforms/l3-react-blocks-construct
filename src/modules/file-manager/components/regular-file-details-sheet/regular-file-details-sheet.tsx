import {
  BaseFileDetailsSheetProps,
  FileDetailsSheet,
} from '../file-manager-details-sheet/file-manager-details-sheet';

export function RegularFileDetailsSheet(props: Omit<BaseFileDetailsSheetProps, 'variant'>) {
  return <FileDetailsSheet {...props} variant="default" />;
}
