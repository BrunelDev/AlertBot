import { AlertForm } from "@/components/alert-form";
import { Bot } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AlertBot
              </h1>
              <p className="text-xs text-muted-foreground">
                Système de signalement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-priority-low opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-priority-low"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Connecté à Telegram
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,400px] lg:gap-12">
          {/* Left Column - Info */}
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Nouveau signalement
              </span>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
                Signalez un incident en temps réel
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Chaque soumission déclenche automatiquement l&apos;envoi
                d&apos;une notification formatée dans votre groupe Telegram.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="order-1 lg:order-2">
            <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm lg:sticky lg:top-8">
              <AlertForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            AlertBot — Système de signalement
          </p>
        </div>
      </footer>
    </main>
  );
}
