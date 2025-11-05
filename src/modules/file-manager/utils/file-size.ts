export const parseFileSize = (size: string): number => {
  const regex = /^([\d.]+)\s*([KMGT]?B)$/i;
  const match = regex.exec(size);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const multipliers: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  return value * (multipliers[unit] ?? 1);
};
