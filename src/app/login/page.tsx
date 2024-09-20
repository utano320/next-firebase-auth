"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, sendEmailLink } from "../../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await sendEmailLink(email);
      alert("サインインリンクを送信しました。メールを確認してください。");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>ログインページ</h1>
      <button onClick={handleGoogleSignIn}>Googleでサインイン</button>
      <hr />
      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">サインインリンクを送信</button>
      </form>
    </div>
  );
}
