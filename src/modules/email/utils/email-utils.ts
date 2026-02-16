export const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>|<p[^>]*>/gi, ' ')
    .replace(/<[^>]{1,10000}>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const makeFirstLetterUpperCase = (word: string) => {
  const firstLetter = word.charAt(0);

  const firstLetterCap = firstLetter.toUpperCase();

  const remainingLetters = word.slice(1);

  const capitalizedWord = firstLetterCap + remainingLetters;
  return capitalizedWord;
};
