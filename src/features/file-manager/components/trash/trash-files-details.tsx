import React from 'react';
import FileDetailsSheet, { BaseFileDetailsSheetProps } from '../file-manager-details-sheet';

export const TrashDetailsSheet: React.FC<Omit<BaseFileDetailsSheetProps, 'variant'>> = (props) => (
  <FileDetailsSheet {...props} variant="trash" />
);
