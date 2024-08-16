import "@/app/globals.css"

export const metadata = {
  title: "Local AI",
  description: "Running AI locally",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
