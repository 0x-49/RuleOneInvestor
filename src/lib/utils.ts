import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param currency The currency code (e.g., 'USD'). Defaults to 'USD'.
 * @param locale The locale to use for formatting. Defaults to 'en-US'.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  if (amount === null || amount === undefined) {
    return '-'; // Or throw an error, or return a default like '$0.00'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as a percentage string.
 * @param value The number to format (e.g., 0.1234 for 12.34%).
 * @param minimumFractionDigits Minimum number of fraction digits. Defaults to 2.
 * @param maximumFractionDigits Maximum number of fraction digits. Defaults to 2.
 * @returns A string representing the formatted percentage.
 */
export function formatPercentage(
  value: number | null | undefined,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2,
): string {
  if (value === null || value === undefined) {
    return '-'; // Or throw an error, or return a default like '0.00%'
  }
  return new Intl.NumberFormat('en-US', { // Locale can be a parameter if needed
    style: 'percent',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
}

