const imageCache = new Map<string, string>();

export function getCachedImage(path: string) {
  return imageCache.get(path);
}

export function setCachedImage(path: string, url: string) {
  imageCache.set(path, url);
}
