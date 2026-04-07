import { NextResponse } from "next/server"

interface ReportData {
  nom: string
  prenom: string
  incidentType: string
  description: string
  priority: string
}

const priorityEmoji: Record<string, string> = {
  faible: "🟢",
  moyen: "🟠",
  critique: "🔴",
}

const incidentEmoji: Record<string, string> = {
  urgence: "🚨",
  information: "ℹ️",
  alerte: "⚠️",
  autre: "📋",
}

const priorityLabels: Record<string, string> = {
  faible: "Faible",
  moyen: "Moyen",
  critique: "CRITIQUE",
}

const incidentLabels: Record<string, string> = {
  urgence: "Urgence",
  information: "Information",
  alerte: "Alerte",
  autre: "Autre",
}

export async function POST(request: Request) {
  try {
    const data: ReportData = await request.json()

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          error:
            "Configuration Telegram manquante. Veuillez configurer TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID.",
        },
        { status: 500 }
      )
    }

    // Format the message for Telegram
    const priorityIcon = priorityEmoji[data.priority] || "⚪"
    const incidentIcon = incidentEmoji[data.incidentType] || "📋"
    const priorityLabel = priorityLabels[data.priority] || data.priority
    const incidentLabel = incidentLabels[data.incidentType] || data.incidentType

    const message = `
${priorityIcon} *NOUVEAU SIGNALEMENT* ${priorityIcon}

👤 *Signalé par:* ${data.prenom} ${data.nom}

${incidentIcon} *Type:* ${incidentLabel}

📊 *Priorité:* ${priorityLabel}

📝 *Description:*
${data.description}

⏰ *Date:* ${new Date().toLocaleString("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
    })}

━━━━━━━━━━━━━━━━━━━━━
_AlertBot - Système de signalement_
`

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    const telegramResponse = await response.json()

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramResponse)
      return NextResponse.json(
        { error: "Erreur lors de l'envoi vers Telegram" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    )
  }
}
