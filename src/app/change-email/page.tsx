"use client";

import { useState, FormEvent, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import {
  verifyBeforeUpdateEmail,
  sendSignInLinkToEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ChangeEmailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChangeEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await verifyBeforeUpdateEmail(user, newEmail);
      setMessage(
        "メールアドレスを更新しました。新しいメールアドレスを確認してください。"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        // 再認証が必要
        try {
          await reauthenticateUser();
          // 再試行
          await verifyBeforeUpdateEmail(user, newEmail);
          setMessage(
            "メールアドレスを更新しました。新しいメールアドレスを確認してください。"
          );
        } catch (reAuthError) {
          console.error(reAuthError);
          setMessage("再認証に失敗しました。もう一度お試しください。");
        }
      } else {
        console.error(error);
        setMessage("メールアドレスの更新に失敗しました。");
      }
    }
  };

  const reauthenticateUser = async () => {
    if (!user || !user.email)
      throw new Error("ユーザー情報が取得できませんでした。");
    // サインインリンクを再送信して再認証
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, user.email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", user.email);
    alert(
      "再認証用のサインインリンクをメールで送信しました。メールを確認してください。"
    );
  };

  return (
    <div>
      <h1>メールアドレスの変更</h1>
      <form onSubmit={handleChangeEmail}>
        <input
          type="email"
          placeholder="新しいメールアドレス"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button type="submit">メールアドレスを変更</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
