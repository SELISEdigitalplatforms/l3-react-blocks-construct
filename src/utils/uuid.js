import { v4 as uuidv4 } from 'uuid';

export const generateUuid = () => {
  const isBrowser = typeof window !== 'undefined';
  const isWorker = !isBrowser && typeof self !== 'undefined';
  const globalObj = isBrowser ? window : isWorker ? self : null;

  const cryptoObj = globalObj?.crypto || null;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return uuidv4();
};

export default generateUuid;
