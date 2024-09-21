// app/layout.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { completeEmailSignIn, reauthenticateWithEmailLink } from "../lib/auth";

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
      // サインインリンクの場合、サインインまたは再認証を完了する
      const email = window.localStorage.getItem("emailForSignIn") || "";
      completeEmailSignIn(url)
        .then(() => {
          router.push("/dashboard");
        })
        .catch(async (error) => {
          if (error.code === "auth/credential-already-in-use") {
            // 再認証の場合
            try {
              await reauthenticateWithEmailLink(email, url);
              router.push("/change-email");
            } catch (reAuthError) {
              console.error(reAuthError);
            }
          } else {
            console.error(error);
          }
        });
    }
  }, [pathname, searchParams, router]);

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
