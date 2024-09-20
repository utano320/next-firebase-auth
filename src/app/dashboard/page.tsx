"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [decodedToken, setDecodedToken] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
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
      <h2>token:</h2>
      <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}
