import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/lib/utils.ts

/**
 * Converts standard YouTube URL (watch?v= or youtu.be) to embed format.
 * @param url YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123)
 * @returns Formatted embed URL (e.g. https://www.youtube.com/embed/abc123) or null
 */
export function formatYouTubeUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}
