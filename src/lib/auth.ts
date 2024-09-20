// lib/auth.ts
import { auth } from "../firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const sendEmailLink = async (email: string): Promise<void> => {
  const actionCodeSettings = {
    url:
      process.env.NEXT_PUBLIC_ACTION_CODE_URL ||
      "http://localhost:7001/dashboard",
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};

export const completeEmailSignIn = async (url: string): Promise<void> => {
  if (isSignInWithEmailLink(auth, url)) {
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("メールアドレスを入力してください") || "";
    }
    await signInWithEmailLink(auth, email, url);
    window.localStorage.removeItem("emailForSignIn");
  }
};
