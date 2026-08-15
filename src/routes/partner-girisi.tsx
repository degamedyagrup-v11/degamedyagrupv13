import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/partner-girisi")({
  head: () => ({
    meta: [
      { title: "Partner Girişi — Dega Medya Grup" },
      {
        name: "description",
        content: "Dega Medya Grup partner ağı üyeleri için rezervasyon ve takvim paneli girişi.",
      },
      { property: "og:title", content: "Partner Girişi — Dega Medya Grup" },
      { property: "og:description", content: "Partner paneline erişin." },
    ],
  }),
  component: TalentLogin,
});

function TalentLogin() {
  const { login } = useDega();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      eyebrow="Partner Ağı Erişimi"
      title="Partner Girişi"
      description="Takviminiz, kaşe bilgileriniz ve yönetim duyurularınız sizi bekliyor."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const res = login("talent", email, password);
          if (res === "ok") {
            toast.success("Partner paneline hoş geldiniz.");
            navigate({ to: "/partner" });
          } else if (res === "pending") {
            toast.error("Başvurunuz yönetim onay kuyruğunda.");
          } else {
            toast.error("E-posta veya şifre hatalı.");
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
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
          Ağda değil misiniz?{" "}
          <Link to="/partner-basvuru" className="text-accent underline-offset-4 hover:underline">
            Resmi İş Birliği Başvurusu
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}