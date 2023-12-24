import dayjs from 'dayjs'
import 'dayjs/locale/ko'

import 'dotenv/config'

import { Telegraf } from 'telegraf'

import { generateEvening } from './services/stocks'

dayjs.locale('ko')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.command('generate_evening', async (ctx) => {
  const { message_id } = await ctx.sendMessage('이브닝 생성을 시작합니다..')

  await generateEvening()

  ctx.sendMessage('이브닝 생성이 완료되었습니다.')
  ctx.deleteMessage(message_id)
})

bot.command('list_excluded_stock', async (ctx) => {
  ctx.reply('list_excluded_stock')
})

bot.command('add_excluded_stock', async (ctx) => {
  ctx.reply('add_excluded_stock')
})

bot.command('remove_excluded_stock', async (ctx) => {
  ctx.reply('remove_excluded_stock')
})

bot.command('health_check', async (ctx) => {
  ctx.reply('health_check')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
