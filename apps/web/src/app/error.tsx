"use client";

import { ErrorState } from "@/components/layout/error-state";

export default function RootError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} />;
}
