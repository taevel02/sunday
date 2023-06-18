import { EvernoteService } from './evernote'
import { StockService } from './stock'
import { TelegramBotService } from './telegram'

export const EvernoteManagement = new EvernoteService()
export const StockManagement = new StockService()
export const TelegramBotManagement = new TelegramBotService()
