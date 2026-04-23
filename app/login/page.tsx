import type { Metadata } from "next";
import LoginPanel from "@/components/auth/LoginPanel";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Connexion | Figeac Aero Tunisie",
  description: "Système de suivi des ordres de fabrication – Figeac Aero Tunisie",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 lg:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[600px]">
        <LoginPanel />
        <LoginForm />
      </div>
    </main>
  );
}
