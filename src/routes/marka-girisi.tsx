import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/marka-girisi")({
  head: () => ({
    meta: [
      { title: "Kurumsal Marka Girişi — Dega Medya Grup" },
      {
        name: "description",
        content: "Kurumsal markalar için Dega Medya Grup medya komuta paneli girişi.",
      },
      { property: "og:title", content: "Kurumsal Marka Girişi — Dega Medya Grup" },
      { property: "og:description", content: "Marka ekosistemi paneline erişin." },
    ],
  }),
  component: BrandLogin,
});

function BrandLogin() {
  const { login } = useDega();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      eyebrow="Kurumsal Marka Erişimi"
      title="Medya İktidarınıza Dönün"
      description="Kampanya portföyünüz, pazaryeri erişiminiz ve global satın alma masanız tek panelde."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const res = login("brand", email, password);
          if (res === "ok") {
            toast.success("Marka paneline hoş geldiniz.");
            navigate({ to: "/marka" });
          } else if (res === "pending") {
            toast.error("Hesabınız yönetim onayında.");
          } else {
            toast.error("E-posta veya şifre hatalı.");
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Kurumsal E-posta</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="gold" size="titan" className="w-full">
          Panele Giriş Yap
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Henüz ekosistemde değil misiniz?{" "}
          <Link to="/marka-kayit" className="text-accent underline-offset-4 hover:underline">
            Global Ekosisteme Katıl
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}