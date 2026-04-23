"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, AlertCircle } from "lucide-react";
import { loginSchema, type LoginSchema } from "@/lib/validations/auth";
import { authApi, tokenStorage, ApiError } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    try {
      const response = await authApi.login(data);
      tokenStorage.set(response.access_token);
      router.push("/dashboard/homepage");
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(
          err.status === 401
            ? "Email ou mot de passe incorrect"
            : err.message,
        );
      } else {
        setServerError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <User className="h-7 w-7 text-[#1B3FA6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Bienvenue
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Connectez-vous à votre compte
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="Entrez votre email"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightElement={
                <button
                  type="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-[#1B3FA6] hover:text-[#1535A0] transition-colors focus:outline-none focus-visible:underline"
              >
                Mot de passe oublié&nbsp;?
              </button>
            </div>
          </div>

          {serverError && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Se connecter
          </Button>
        </form>

        {/* Footer */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          Accès réservé aux employés de Figeac Aero Tunisie
        </p>
      </div>
    </div>
  );
}
