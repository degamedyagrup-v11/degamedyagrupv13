import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDega, type Metrics, type TalentCategory } from "@/lib/dega-store";

export const Route = createFileRoute("/partner-basvuru")({
  head: () => ({
    meta: [
      { title: "Resmi İş Birliği Başvurusu — Dega Medya Grup" },
      {
        name: "description",
        content:
          "Influencer, model, oyuncu, DJ ve sanatçılar için Dega Medya Grup resmi partner başvuru formu.",
      },
      { property: "og:title", content: "Resmi İş Birliği Başvurusu — Dega Medya Grup" },
      {
        property: "og:description",
        content: "Dünyanın en büyük partner ağına resmi başvuru yapın.",
      },
    ],
  }),
  component: TalentApply,
});

const CATEGORIES: TalentCategory[] = [
  "Influencer",
  "Sayfa",
  "TV",
  "Model",
  "Oyuncu",
  "DJ",
  "Sanatçı",
];

const isSocialTier = (c?: TalentCategory) => c === "Influencer" || c === "Sayfa" || c === "TV";
const isPhysicalTier = (c?: TalentCategory) => c === "Model" || c === "Oyuncu";
const isMusicTier = (c?: TalentCategory) => c === "DJ" || c === "Sanatçı";

function TalentApply() {
  const { register } = useDega();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>();
  const [category, setCategory] = useState<TalentCategory | undefined>();
  const [metrics, setMetrics] = useState<Metrics>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    basePrice: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    x: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setM = (k: keyof Metrics, v: string) => setMetrics((m) => ({ ...m, [k]: v }));

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const steps = ["Kimlik", "Doğrulama", "Portföy & Kaşe"];

  return (
    <AuthLayout
      wide
      eyebrow="Resmi Partner Başvurusu"
      title="Dünyanın En Büyük Partner Ağına Katıl"
      description="Başvurunuz holding yönetimi tarafından incelenir. Onaylanan partnerler anında küresel pazaryerine yayınlanır."
    >
      <div className="mb-8 flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-3">
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                step > i
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {step > i + 1 ? <Check className="size-4" /> : i + 1}
            </div>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground md:block">
              {s}
            </span>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2 flex items-center gap-5">
            <div className="grid size-24 place-items-center overflow-hidden rounded-2xl border border-accent/40 bg-primary/15">
              {avatar ? (
                <img src={avatar} alt="Profil görseli" className="size-full object-cover" />
              ) : (
                <Upload className="size-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <Label>Avatar / Logo</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Pazaryerinde görünecek yüksek çözünürlüklü kare görsel.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <Button type="button" variant="glass" size="sm" className="mt-3" onClick={() => fileRef.current?.click()}>
                Görsel Yükle
              </Button>
            </div>
          </div>
          <F label="Ad Soyad / Sahne Adı" value={form.name} onChange={(v) => set("name", v)} />
          <F label="E-posta" type="email" value={form.email} onChange={(v) => set("email", v)} />
          <F label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} />
          <F label="Şehir" value={form.city} onChange={(v) => set("city", v)} />
          <F label="Şifre" type="password" value={form.password} onChange={(v) => set("password", v)} />
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={category ?? ""} onValueChange={(v) => setCategory(v as TalentCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button
              type="button"
              variant="gold"
              size="titan"
              className="w-full"
              onClick={() => {
                if (!form.name || !form.email || !form.phone || !form.password || !category) {
                  toast.error("Lütfen tüm zorunlu alanları doldurun.");
                  return;
                }
                setStep(2);
              }}
            >
              Devam Et
            </Button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="glass-panel flex items-start gap-4 p-5">
            <ShieldCheck className="mt-0.5 size-5 text-accent" />
            <p className="text-sm text-muted-foreground">
              Güvenlik protokolümüz gereği <span className="text-foreground">{form.phone}</span>{" "}
              numarasına 6 haneli tek kullanımlık doğrulama kodu gönderilir.
            </p>
          </div>
          <Button
            type="button"
            variant="titan"
            className="w-full"
            onClick={() => {
              setOtpSent(true);
              toast.success("Doğrulama kodu SMS ile gönderildi.");
            }}
          >
            {otpSent ? "Kodu Tekrar Gönder" : "SMS Doğrulama Kodu Gönder"}
          </Button>
          <div className="space-y-2">
            <Label>Doğrulama Kodu</Label>
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="● ● ● ● ● ●"
              className="text-center text-2xl tracking-[0.6em]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="glass" onClick={() => setStep(1)}>
              Geri
            </Button>
            <Button
              type="button"
              variant="gold"
              size="titan"
              className="flex-1"
              onClick={() => {
                if (!otpSent) {
                  toast.error("Önce doğrulama kodu talep edin.");
                  return;
                }
                if (otp.length !== 6) {
                  toast.error("6 haneli kodu giriniz.");
                  return;
                }
                toast.success("Telefon numaranız doğrulandı.");
                setStep(3);
              }}
            >
              Doğrula
            </Button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid gap-5 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            register({
              role: "talent",
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              city: form.city,
              avatar,
              category,
              basePrice: Number(form.basePrice) || 0,
              margin: 30,
              metrics,
              socials: {
                instagram: form.instagram,
                tiktok: form.tiktok,
                youtube: form.youtube,
                x: form.x,
              },
              availability: [],
            });
            toast.success("Başvurunuz yönetim onay kuyruğuna alındı.");
            navigate({ to: "/partner-girisi" });
          }}
        >
          {isSocialTier(category) && (
            <>
              <F label="Takipçi Sayısı" value={metrics.followers ?? ""} onChange={(v) => setM("followers", v)} />
              <F label="Aylık Ortalama Reels İzlenmesi" value={metrics.reels ?? ""} onChange={(v) => setM("reels", v)} />
              <F label="Story Görüntülenmesi" value={metrics.story ?? ""} onChange={(v) => setM("story", v)} />
              <F label="Etkileşim Oranı (%)" value={metrics.engagement ?? ""} onChange={(v) => setM("engagement", v)} />
            </>
          )}
          {isPhysicalTier(category) && (
            <>
              <F label="Boy (cm)" value={metrics.height ?? ""} onChange={(v) => setM("height", v)} />
              <F label="Kilo (kg)" value={metrics.weight ?? ""} onChange={(v) => setM("weight", v)} />
              <F label="Göz Rengi" value={metrics.eyeColor ?? ""} onChange={(v) => setM("eyeColor", v)} />
              <F label="Saç Rengi" value={metrics.hairColor ?? ""} onChange={(v) => setM("hairColor", v)} />
              <F label="Ayak Numarası" value={metrics.shoeSize ?? ""} onChange={(v) => setM("shoeSize", v)} />
            </>
          )}
          {isMusicTier(category) && (
            <>
              <F label="Müzik Tarzı" value={metrics.musicStyle ?? ""} onChange={(v) => setM("musicStyle", v)} />
              <div className="space-y-2 md:col-span-2">
                <Label>Teknik Rider</Label>
                <Textarea
                  rows={3}
                  value={metrics.rider ?? ""}
                  onChange={(e) => setM("rider", e.target.value)}
                  placeholder="Sahne, ses, ışık ve ekipman gereksinimleri"
                />
              </div>
            </>
          )}

          <F label="Taban Kaşe Fiyatı (₺)" value={form.basePrice} onChange={(v) => set("basePrice", v)} />
          <F label="Instagram URL" required={false} value={form.instagram} onChange={(v) => set("instagram", v)} />
          <F label="TikTok URL" required={false} value={form.tiktok} onChange={(v) => set("tiktok", v)} />
          <F label="YouTube URL" required={false} value={form.youtube} onChange={(v) => set("youtube", v)} />
          <F label="X (Twitter) URL" required={false} value={form.x} onChange={(v) => set("x", v)} />

          <div className="space-y-2 md:col-span-2">
            <Label>Yönetime Not</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <div className="flex gap-3 md:col-span-2">
            <Button type="button" variant="glass" onClick={() => setStep(2)}>
              Geri
            </Button>
            <Button type="submit" variant="gold" size="titan" className="flex-1">
              Resmi Başvuruyu Gönder
            </Button>
          </div>
        </motion.form>
      )}
    </AuthLayout>
  );
}

function F({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}