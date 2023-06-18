import TelegramBot from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
const telegramBot = new TelegramBot(token, { polling: true })

export class TelegramBotService {
  public async sendMessage(message: string) {
    const { message_id, text } = await telegramBot.sendMessage(
      chatId,
      `🐣 ${message}`,
      {
        disable_web_page_preview: true
      }
    )
    return { messageId: message_id, text }
  }

  public async deleteMessage(messageId: number) {
    await telegramBot.deleteMessage(chatId, messageId)
  }
}
