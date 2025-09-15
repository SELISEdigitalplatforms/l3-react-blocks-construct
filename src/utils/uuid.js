import { v4 as uuidv4 } from 'uuid';

export const generateUuid = () => {
  const g = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : null;
  const cryptoObj = (g && g.crypto) || null;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return uuidv4();
};

export default generateUuid;
