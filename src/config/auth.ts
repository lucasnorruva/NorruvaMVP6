
export const API_KEYS: string[] = (process.env.VALID_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);
