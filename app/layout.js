import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Credex | Stop Overspending on AI Tools",
  description: "Analyze your AI stack and uncover hidden savings in under 60 seconds with Credex AI Spend Audit.",
  openGraph: {
    title: "Credex | AI Spend Audit",
    description: "Find hidden savings in your AI stack in under 60 seconds.",
    url: "https://credex.ai",
    siteName: "Credex",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credex | AI Spend Audit",
    description: "Stop overspending on AI tools. Get your free audit today.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm" />
              </div>
              <span className="text-xl font-bold tracking-tight">Credex</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/audit" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2">
                Start Free Audit
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}
