import { Bot } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AlertBot</h1>
            <p className="text-xs text-muted-foreground">Système de signalement</p>
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
  );
}
