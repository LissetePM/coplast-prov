// Formato de moneda en pesos mexicanos: 1832.8 -> "$1,832.80"

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(value: number): string {
  return mxn.format(value);
}
