import FileDetailsSheet, { BaseFileDetailsSheetProps } from './file-manager-details-sheet';

export const RegularFileDetailsSheet: React.FC<Omit<BaseFileDetailsSheetProps, 'variant'>> = (
  props
) => <FileDetailsSheet {...props} variant="default" />;
