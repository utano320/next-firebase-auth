"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { completeEmailSignIn } from "../lib/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = window.location.href;
    if (searchParams && searchParams.has("oobCode")) {
      // サインインリンクの場合、サインインを完了する
      completeEmailSignIn(url)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [pathname, searchParams, router]);

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
