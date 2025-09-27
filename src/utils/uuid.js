import { v4 as uuidv4 } from 'uuid';

export const generateUuid = () => {
  let globalObj = null;
  if (typeof window !== 'undefined') {
    globalObj = window;
  } else if (typeof self !== 'undefined') {
    globalObj = self;
  }

  const cryptoObj = globalObj?.crypto || null;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return uuidv4();
};

export default generateUuid;
