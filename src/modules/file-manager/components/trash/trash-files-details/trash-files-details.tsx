import {
  BaseFileDetailsSheetProps,
  FileDetailsSheet,
} from '../../file-manager-details-sheet/file-manager-details-sheet';

export function TrashDetailsSheet(props: Omit<BaseFileDetailsSheetProps, 'variant'>) {
  return <FileDetailsSheet {...props} variant="trash" />;
}
