export type Service = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
};

export const CATEGORIES = [
  "Hazır Kampanyalar",
  "Dijital & Teknoloji",
  "Yetenek Ağı",
  "Geleneksel Medya",
  "Eğlence",
  "Prodüksiyon",
] as const;

export const SERVICES: Service[] = [
  {
    id: "s-dt-1",
    category: "Dijital & Teknoloji",
    title: "Performans Medya Komuta Merkezi",
    description: "7/24 optimize edilen çok kanallı performans yönetimi ve gerçek zamanlı veri kokpiti.",
    price: 420000,
  },
  {
    id: "s-dt-2",
    category: "Dijital & Teknoloji",
    title: "Yapay Zekâ Destekli Marka Zekâsı",
    description: "Trend tahmini, duygu analizi ve rakip istihbaratı içeren kurumsal AI paneli.",
    price: 610000,
  },
  {
    id: "s-dt-3",
    category: "Dijital & Teknoloji",
    title: "Kurumsal Web & Uygulama Mimarisi",
    description: "Global ölçekte çalışan, çok dilli dijital altyapı ve deneyim tasarımı.",
    price: 890000,
  },
  {
    id: "s-gm-1",
    category: "Geleneksel Medya",
    title: "Ulusal TV Prime-Time Kuşağı",
    description: "Ulusal kanallarda prime-time reklam kuşağı satın alımı ve yayın planlaması.",
    price: 2450000,
  },
  {
    id: "s-gm-2",
    category: "Geleneksel Medya",
    title: "Metropol OOH & Billboard Ağı",
    description: "12 metropolde 4.800 yüzeylik açıkhava egemenliği.",
    price: 1320000,
  },
  {
    id: "s-gm-3",
    category: "Geleneksel Medya",
    title: "Radyo & Basın İmparatorluğu",
    description: "Ulusal radyo rotasyonu ve editoryal basın yerleşimleri.",
    price: 480000,
  },
  {
    id: "s-eg-1",
    category: "Eğlence",
    title: "Arena Konser & Festival Yapımı",
    description: "50.000 kapasiteli arena etkinliği: sanatçı, sahne, güvenlik ve bilet ekosistemi.",
    price: 6200000,
  },
  {
    id: "s-eg-2",
    category: "Eğlence",
    title: "Gece Kulübü & Lounge Aktivasyonu",
    description: "Premium mekân ağında marka geceleri ve VIP misafir yönetimi.",
    price: 340000,
  },
  {
    id: "s-pr-1",
    category: "Prodüksiyon",
    title: "Sinematik Reklam Filmi (4K/8K)",
    description: "Ödüllü yönetmen kadrosu ile uluslararası standartlarda film prodüksiyonu.",
    price: 1750000,
  },
  {
    id: "s-pr-2",
    category: "Prodüksiyon",
    title: "Stüdyo & Post-Prodüksiyon Kompleksi",
    description: "Sınırsız stüdyo erişimi, VFX, renk ve ses tasarımı.",
    price: 520000,
  },
  {
    id: "s-pr-3",
    category: "Prodüksiyon",
    title: "Dikey İçerik Fabrikası",
    description: "Aylık 120 adet platforma özel dikey içerik üretimi.",
    price: 295000,
  },
];