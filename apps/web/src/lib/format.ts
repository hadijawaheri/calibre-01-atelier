const numberFormat = new Intl.NumberFormat("fa-IR");
const dateFormat = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  dateStyle: "medium",
  timeZone: "Asia/Tehran",
});
const dateTimeFormat = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

export const formatNumber = (value: number): string => numberFormat.format(value);

/** Prices are stored in Rial; customers read Toman. */
export const formatToman = (rial: number): string =>
  `${numberFormat.format(Math.round(rial / 10))} تومان`;

export const formatDate = (value: Date | string): string => dateFormat.format(new Date(value));

export const formatDateTime = (value: Date | string): string =>
  dateTimeFormat.format(new Date(value));
