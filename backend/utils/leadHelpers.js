const sanitizeText = (value = "") =>
  String(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const isValidMobile = (value = "") => /^[0-9]{10,15}$/.test(String(value).trim());

const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim().toLowerCase());

const buildDateFilter = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return null;
  }

  const createdAt = {};

  if (startDate) {
    createdAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
  }

  if (endDate) {
    createdAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
  }

  return { createdAt };
};

const toCsv = (headers, rows) => {
  const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const headerRow = headers.map((header) => escapeCsv(header.label)).join(",");
  const dataRows = rows.map((row) =>
    headers.map((header) => escapeCsv(row[header.key])).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
};

module.exports = {
  sanitizeText,
  isValidMobile,
  isValidEmail,
  buildDateFilter,
  toCsv,
};
