import { AlertForm } from "@/components/alert-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

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

      <Footer />
    </main>
  );
}
