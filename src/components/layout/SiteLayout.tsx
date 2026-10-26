import { Cormorant_Garamond, Jost } from 'next/font/google'
import Script from 'next/script'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { landingLocales, type LandingLocale } from '@/lib/landing'
import { businessSchema, personSchema } from '@/lib/business'

function serializeJsonLd(schema: Record<string, unknown>) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export default function SiteLayout({
  children,
  locale = 'en',
  landing = false,
}: Readonly<{
  children: React.ReactNode
  locale?: LandingLocale
  landing?: boolean
}>) {
  return (
    <html
      lang={landingLocales[locale].lang}
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F4] text-[#2C2C2C]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(businessSchema) }}
        />
        {process.env.NODE_ENV === 'production' && <><Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5B5KJV854H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5B5KJV854H');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wdcr9p47cd");
          `}
        </Script>
        </>}
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} landing={landing} />
      </body>
    </html>
  )
}
