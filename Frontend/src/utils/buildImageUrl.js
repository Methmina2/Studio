export const buildImageUrl = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  const normalizedImage = image.startsWith('/') ? image : `/${image}`;
  // Only prepend backend URL for uploads; /images/ is served by Vite from public folder
  if (normalizedImage.startsWith('/uploads/')) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
    return `${baseUrl}${encodeURI(normalizedImage)}`;
  }
  // /images/ and other paths are served by frontend
  return encodeURI(normalizedImage);
};
