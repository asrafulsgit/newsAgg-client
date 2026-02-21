import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns';

export const formatRelativeDate = (dateStr?: string): string => {
  if (!dateStr) return 'Unknown date';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return 'Unknown date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
};

export const formatFullDate = (dateStr?: string): string => {
  if (!dateStr) return 'Unknown date';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return 'Unknown date';
    return format(date, 'MMMM d, yyyy · h:mm a');
  } catch {
    return 'Unknown date';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

export const getLanguageName = (code: string): string => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

export const getCountryName = (code: string): string => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

export const getSentimentColor = (sentiment?: string): string => {
  switch (sentiment?.toLowerCase()) {
    case 'positive': return 'text-green-600 bg-green-50';
    case 'negative': return 'text-red-600 bg-red-50';
    case 'neutral': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getCategoryColor = (category: string): string => {
  const map: Record<string, string> = {
    technology: 'bg-blue-100 text-blue-800',
    business: 'bg-yellow-100 text-yellow-800',
    sports: 'bg-green-100 text-green-800',
    health: 'bg-pink-100 text-pink-800',
    science: 'bg-purple-100 text-purple-800',
    entertainment: 'bg-orange-100 text-orange-800',
    politics: 'bg-red-100 text-red-800',
    world: 'bg-indigo-100 text-indigo-800',
    environment: 'bg-teal-100 text-teal-800',
    education: 'bg-cyan-100 text-cyan-800',
  };
  return map[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
};
