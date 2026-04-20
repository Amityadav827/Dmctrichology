const normalizeKeywords = (keywords) => {
  if (!keywords) {
    return [];
  }

  if (Array.isArray(keywords)) {
    return keywords
      .map((keyword) => String(keyword).trim())
      .filter(Boolean);
  }

  if (typeof keywords === "string") {
    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return [];
};

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildSitemapXml = (entries) => {
  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
};

module.exports = {
  normalizeKeywords,
  buildSitemapXml,
};
