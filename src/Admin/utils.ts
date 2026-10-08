export const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-");

export const fmtDateTime = (d?: string) => (d ? new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-");

/** 0812... -> https://wa.me/62812... */
export const waLink = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? "62" + digits.slice(1) : digits}`;
};
