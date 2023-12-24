import dayjs from 'dayjs'
import 'dayjs/locale/ko'

import 'dotenv/config'

import { Telegraf } from 'telegraf'

import {
  addExceptionalStock,
  deleteExceptionalStock,
  generateEvening,
  readExceptionalStocks
} from './services/stocks'

dayjs.locale('ko')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.command('generate_evening', async (ctx) => {
  const { message_id } = await ctx.sendMessage('이브닝 생성을 시작합니다..')

  await generateEvening()

  ctx.deleteMessage(message_id)
  ctx.sendMessage('이브닝 생성이 완료되었습니다.')
})

bot.command('list_excluded_stock', async (ctx) => {
  const { message_id } = await ctx.sendMessage(
    '이브닝에서 제외한 종목을 조회합니다..'
  )

  const { message } = await readExceptionalStocks()

  ctx.deleteMessage(message_id)
  ctx.sendMessage(message)
})

bot.command('add_excluded_stock', async (ctx) => {
  const arg = ctx.message.text.split(' ')[1]
  if (!arg) {
    ctx.sendMessage('종목 이름을 입력해주세요.')
    return
  }

  const { message_id } = await ctx.sendMessage(
    '이브닝에서 제외할 종목을 추가합니다..'
  )

  const { message } = await addExceptionalStock(arg)

  ctx.deleteMessage(message_id)
  ctx.sendMessage(message)
})

bot.command('remove_excluded_stock', async (ctx) => {
  const arg = ctx.message.text.split(' ')[1]
  if (!arg) {
    ctx.sendMessage('종목 이름을 입력해주세요.')
    return
  }

  const { message_id } = await ctx.sendMessage(
    '이브닝에서 제외할 종목을 제거합니다..'
  )

  const { message } = await deleteExceptionalStock(arg)

  ctx.deleteMessage(message_id)
  ctx.sendMessage(message)
})

bot.command('health_check', async (ctx) => {
  ctx.reply('health_check')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
