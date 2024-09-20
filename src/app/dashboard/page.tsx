// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        setIdToken(token);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>ようこそ、{user.email || user.displayName}さん</h1>
      <p>IDトークン: {idToken}</p>
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}
