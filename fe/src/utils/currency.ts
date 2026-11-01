/**
 * Format price given in thousands of VND (e.g. 275 -> "275.000₫")
 */
export function formatPrice(priceInThousands: number): string {
  const fullAmount = priceInThousands * 1000;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(fullAmount);
}

/**
 * Format raw number amount into standard VND formatted string with dot separators
 */
export function formatThousands(valueInThousands: number): string {
  return `${valueInThousands.toLocaleString('vi-VN')}.000₫`;
}
