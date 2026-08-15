import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/yonetim-girisi")({
  head: () => ({
    meta: [
      { title: "Yönetim Girişi — Dega Medya Grup" },
      { name: "description", content: "Dega Medya Grup holding komuta merkezi yönetim erişimi." },
      { property: "og:title", content: "Yönetim Girişi — Dega Medya Grup" },
      { property: "og:description", content: "Holding komuta merkezi erişimi." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { loginAdmin } = useDega();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      eyebrow="Holding Komuta Merkezi"
      title="Yönetim Erişimi"
      description="Bu kapı yalnızca holding icra yönetimine açıktır. Tüm erişim denemeleri kayıt altına alınır."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (loginAdmin(email, password)) {
            toast.success("Komuta merkezine hoş geldiniz.");
            navigate({ to: "/yonetim" });
          } else {
            toast.error("Erişim reddedildi.");
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
          Komuta Merkezine Gir
        </Button>
      </form>
    </AuthLayout>
  );
}