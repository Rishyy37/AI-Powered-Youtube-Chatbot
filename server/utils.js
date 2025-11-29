// utils.js (create this file)
export function extractVideoId(urlOrId) {
  // If it's already a video ID (11 characters, no special characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  
  // Extract from various YouTube URL formats
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = urlOrId.match(regex);
  return match ? match[1] : null;
}