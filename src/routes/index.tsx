import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Globe2, Sparkles, Star, Shield, Clapperboard } from "lucide-react";

import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Brandmark } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dega Medya Grup — MEDYA & YAYINCILIKTA STRATEJİK BÜYÜME" },
      {
        name: "description",
        content:
          "Dega Medya Grup: markalar için 360 derece medya iktidarı, yetenekler için dünyanın en büyük partner ağı.",
      },
      { property: "og:title", content: "Dega Medya Grup — Küresel Medya İktidarına Hükmet" },
      {
        property: "og:description",
        content: "Kurumsal marka ekosistemi, partner ağı ve omni-pazaryeri tek imparatorlukta.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { k: "81", l: "İLDE KAPSAMA AĞI" },
  { k: "500+", l: "GÜÇLÜ İŞ BİRLİĞİ" },
  { k: "%99", l: "MÜŞTERİ MEMNUNİYETİ" },
  { k: "360°", l: "Entegre Ekosistem" },
];

const divisions = [
  {
    icon: Globe2,
    t: "Dijital & Teknoloji",
    d: "Yapay zekâ destekli medya satın alma ve marka istihbarat altyapısı.",
  },
  {
    icon: Star,
    t: "Yetenek Ağı",
    d: "Influencer, model, oyuncu, DJ ve sanatçılardan oluşan küresel kadro.",
  },
  {
    icon: Clapperboard,
    t: "Prodüksiyon & Eğlence",
    d: "Sinematik prodüksiyon, arena etkinlikleri ve prime-time yapımlar.",
  },
  {
    icon: Shield,
    t: "Geleneksel Medya",
    d: "TV, radyo, basın ve açıkhava egemenliğinde stratejik yayın gücü.",
  },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundLayer />

      <header className="relative z-20 flex items-center justify-between px-6 py-6">
        <Brandmark />
        <div className="flex items-center gap-2">
          <Button asChild variant="glass" size="sm">
            <Link to="/yonetim-girisi">Yönetim Girişi</Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1500px] px-5 pb-16 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-background/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.35em] text-accent backdrop-blur-md">
            <Sparkles className="size-3" /> DİJİTAL MEDYA & PRODÜKSİYON
          </p>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] md:text-6xl">
            <span className="text-imperial">GÜÇLÜ VE ENTEGRE 360° MEDYA ÇÖZÜMLERİ</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Dega Medya Grup; markaların küresel etkisini, yeteneklerin kaderini ve medyanın
            geleceğini tek bir komuta merkezinden yönetir. Yenilikçi stratejiler ve güçlü yayın ağıyla markanızın geleceğini inşa ediyoruz.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[
            {
              side: "Küresel Markalar İçin",
              icon: Building2,
              title: "Küresel Medya İktidarına Hükmet",
              copy: "Ulusal ve uluslararası mecralarda yayın gücü, geniş açıkhava ağları ve hedef odaklı medya satın alma çözümleriyle markanızı öne çıkarıyoruz",
              primary: { to: "/marka-girisi", label: "Kurumsal Marka Girişi" },
              secondary: { to: "/marka-kayit", label: "Global Ekosisteme Katıl" },
            },
            {
              side: "Yetenekler İçin",
              icon: Star,
              title: "Dünyanın En Büyük Partner Ağında Yerini Al.",
              copy: "Sektörün önde gelen yayıncıları ve çözüm ortaklarından oluşan geniş partner ağımızla, markanıza değer katan profesyonel medya planlama ve rezervasyon yönetimi sunuyoruz",
              primary: { to: "/partner-girisi", label: "Partner Girişi" },
              secondary: { to: "/partner-basvuru", label: "Resmi İş Birliği Başvurusu" },
            },
          ].map((p, i) => (
            <motion.div
              key={p.side}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.15 }}
              className="glass-panel relative overflow-hidden p-7 md:p-10"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-accent">
                  <p.icon className="size-4" /> {p.side}
                </p>
                <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>

                <div className="mt-9 flex flex-col gap-4">
                  <Button asChild variant="gold" size="titan" className="w-full">
                    <Link to={p.primary.to}>{p.primary.label}</Link>
                  </Button>
                  <Button asChild variant="titan" size="titan" className="w-full">
                    <Link to={p.secondary.to}>{p.secondary.label}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="glass-panel px-5 py-6 text-center">
              <p className="font-display text-2xl font-bold text-imperial md:text-3xl">{s.k}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold md:text-4xl">
            <span className="text-imperial">Holding Divizyonları</span>
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {divisions.map((d) => (
              <motion.div
                key={d.t}
                whileHover={{ y: -6 }}
                className="glass-panel p-6 transition-colors hover:border-accent/50"
              >
                <d.icon className="size-6 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 bg-background/60 px-6 py-10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <Brandmark />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} © 2026 Dega Medya Grup. Tüm Hakları Saklıdır. | İletişim: 0535 885 56 85 | contact@degamedyagrup.com
          </p>
        </div>
      </footer>
    </div>
  );
}
