export const jsonFetcher = (url, options) => fetch(url, options).then(r => r.json());