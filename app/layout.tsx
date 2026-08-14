import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'

export const metadata: Metadata = {
  title: 'VU. COURSES - المنصة التعليمية الشاملة لتطوير البرمجيات',
  description: 'منصة برمجية متكاملة لتعليم تطوير الويب والتقنيات البرمجية الحديثة مع نظام الشهادات التفاعلية والدروس المباشرة.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="h-full antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 page-transition">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
