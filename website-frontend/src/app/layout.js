import './globals.css';

export const metadata = {
  title: 'Dynamic Website Frontend',
  description: 'WordPress-like CMS Controlled',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <svg width="0" height="0" className="hidden" style={{ display: 'none' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F09819" />
              <stop offset="47%" stopColor="#E4B753" />
              <stop offset="100%" stopColor="#EDDB5A" />
            </linearGradient>
          </defs>
        </svg>
      </body>
    </html>
  );
}
