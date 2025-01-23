import './globals.css';
import { ThemeProvider } from './theme-provider';

export const metadata = {
  title: 'Memorable Quantities',
  description: 'Convert numbers into memorable comparisons',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 