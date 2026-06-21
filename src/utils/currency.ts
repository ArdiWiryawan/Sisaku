export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(Math.round(value))
    .replace(/Rp\s+/u, "Rp");
}

export function formatRupiahAbs(value: number): string {
  return formatRupiah(Math.abs(value));
}

export function parseMoneyInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, "");
  return Number(cleaned || 0);
}
