import {
  BaseFileDetailsSheetProps,
  FileDetailsSheet,
} from '../file-manager-details-sheet/file-manager-details-sheet';

export const RegularFileDetailsSheet: React.FC<Omit<BaseFileDetailsSheetProps, 'variant'>> = (
  props
) => <FileDetailsSheet {...props} variant="default" />;
