"use client";

import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="flex min-h-dvh items-center justify-center bg-background p-6 font-sans text-foreground">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl">سایت موقتاً در دسترس نیست</h1>
          <p className="text-muted-foreground">چند لحظه بعد دوباره تلاش کنید.</p>
          <button
            type="button"
            onClick={reset}
            className="bg-primary px-6 py-2 text-primary-foreground"
          >
            تلاش دوباره
          </button>
        </div>
      </body>
    </html>
  );
}
