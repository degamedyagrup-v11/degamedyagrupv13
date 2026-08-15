import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { BackgroundLayer } from "./BackgroundLayer";
import { Brandmark } from "./AppShell";

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundLayer intensity={0.45} />
      <header className="flex items-center justify-between px-6 py-5">
        <Brandmark />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" /> Ana Kapı
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className={`glass-panel w-full p-7 md:p-10 ${wide ? "max-w-4xl" : "max-w-lg"}`}
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            <span className="text-imperial">{title}</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}