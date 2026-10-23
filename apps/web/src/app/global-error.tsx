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
          <h1 className="display">سایت موقتاً در دسترس نیست</h1>
          <p className="text-muted-foreground">چند لحظه بعد دوباره تلاش کنید.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 h-12 bg-primary px-8 text-sm text-primary-foreground"
          >
            تلاش دوباره
          </button>
        </div>
      </body>
    </html>
  );
}
