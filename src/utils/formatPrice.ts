export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function calculateDiscountPercent(
  original: number,
  sale: number,
): number {
  if (original <= 0) return 0;
  return Math.round(((original - sale) / original) * 100);
}
