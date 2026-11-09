import './globals.css';

export const metadata = {
  title: 'zen-money',
  description: 'Личные финансы и история операций'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
