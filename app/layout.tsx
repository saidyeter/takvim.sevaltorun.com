import "@/styles/globals.css"
import { Metadata, Viewport } from "next"

import { SiteFooter } from "@/components/site-footer"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site"
import { AuthProvider } from "@/lib/auth-provider"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: {
    icon: "/calendar.svg",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1 md:container md:max-w-5xl p-4">{children}</div>
                <SiteFooter />
              </div>
              <TailwindIndicator />
            </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </>
  )
}
