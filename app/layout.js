import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Inter } from 'next/font/google';
import '@/app/globals.scss';

import { AxiosInit } from '@/components/AxiosInit';

// eslint-disable-next-line new-cap
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js AI Lab',
  description: '本專案基於 Next.js，專注於測試與學習各種人工智慧相關套件與技術。',
  keywords: [
    'Next.js',
    '人工智慧',
    'AI',
    '機器學習',
    '深度學習',
    'TensorFlow.js',
    'HuggingFace',
    'ml5.js',
    'p5.js',
    '前端開發'
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/images/ico/favicon.ico'
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-tw">
      <body className={inter.className}>
        <AxiosInit />
        {/* {children} */}
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
