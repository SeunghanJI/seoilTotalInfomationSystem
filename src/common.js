export const objectToQueryString = (obj) => {
  const qs = Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return qs;
};
