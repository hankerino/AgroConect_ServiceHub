import { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function createPageUrl(page: string) {
  return `/${page}`
}
