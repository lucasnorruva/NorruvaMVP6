export const EU_COUNTRY_CODES: Set<string> = new Set([
  'AUT','BEL','BGR','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU','GRC','HUN','IRL','ITA','LVA','LTU','LUX','MLT','NLD','POL','PRT','ROU','SVK','SVN','ESP','SWE'
]);

export function isEuCountry(code: string | null | undefined): boolean {
  if (!code) return false;
  return EU_COUNTRY_CODES.has(code.toUpperCase());
}
