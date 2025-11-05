import React from 'react';
import {
  BaseFileDetailsSheetProps,
  FileDetailsSheet,
} from '../../file-manager-details-sheet/file-manager-details-sheet';

export const TrashDetailsSheet: React.FC<Omit<BaseFileDetailsSheetProps, 'variant'>> = (props) => (
  <FileDetailsSheet {...props} variant="trash" />
);
