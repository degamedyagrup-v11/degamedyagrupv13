import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDega } from "@/lib/dega-store";

export const Route = createFileRoute("/marka-kayit")({
  head: () => ({
    meta: [
      { title: "Global Ekosisteme Katıl — Dega Medya Grup" },
      {
        name: "description",
        content: "Kurumsal marka kaydı ile Dega Medya Grup global medya ekosistemine katılın.",
      },
      { property: "og:title", content: "Global Ekosisteme Katıl — Dega Medya Grup" },
      { property: "og:description", content: "Kurumsal marka kaydı ve pazaryeri erişimi." },
    ],
  }),
  component: BrandRegister,
});

function BrandRegister() {
  const { register } = useDega();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    brief: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AuthLayout
      wide
      eyebrow="Kurumsal Kayıt"
      title="Global Ekosisteme Katıl"
      description="Holding masanıza atanacak stratejik ekip için kurumsal bilgilerinizi tanımlayın. Kayıt sonrası pazaryeri erişiminiz anında açılır."
    >
      <form
        className="grid gap-5 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          register({
            role: "brand",
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            company: form.company,
            city: form.city,
            basePrice: 0,
            margin: 0,
            metrics: {},
            socials: {},
            availability: [],
          });
          toast.success("Kurumsal hesabınız oluşturuldu.");
          navigate({ to: "/marka" });
        }}
      >
        <Field label="Şirket / Holding Adı" value={form.company} onChange={(v) => set("company", v)} />
        <Field label="Yetkili Ad Soyad" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Kurumsal E-posta" type="email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} />
        <Field label="Merkez Şehir" value={form.city} onChange={(v) => set("city", v)} />
        <Field label="Şifre" type="password" value={form.password} onChange={(v) => set("password", v)} />
        <div className="space-y-2 md:col-span-2">
          <Label>Kampanya Vizyonunuz</Label>
          <Textarea
            rows={4}
            value={form.brief}
            onChange={(e) => set("brief", e.target.value)}
            placeholder="Hedef pazarlar, bütçe aralığı ve stratejik beklentileriniz"
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" variant="gold" size="titan" className="w-full">
            Ekosisteme Katıl
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} required value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}