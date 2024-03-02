import dayjs from 'dayjs'
import 'dayjs/locale/ko'

import 'dotenv/config'

import { Telegraf } from 'telegraf'
import schedule from 'node-schedule'

import {
  addExceptionalStock,
  deleteExceptionalStock,
  generateEvening,
  getCondition,
  readExceptionalStocks,
  setCondition
} from './services/stocks'
import { checkNewYouthHousing } from './services/soco'

import { isHoliday } from './tools/is-holiday'

dayjs.locale('ko')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
const jobs = new Map<number, schedule.Job>()

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

bot.command('set_upper_condition', async (ctx) => {
  const status = (await getCondition('상한가테마추적')).isEnabled
  await setCondition('상한가테마추적', !status)

  ctx.sendMessage(`상한가 테마 추적을 ${!status ? '사용' : '중지'}합니다.`)
})

bot.command('auto_generate_evening', async (ctx) => {
  const userId = ctx.message.from.id
  const jobKey = userId * 2

  if (jobs.has(jobKey)) {
    const job = jobs.get(jobKey)
    job.cancel()
    jobs.delete(jobKey)
    ctx.sendMessage('자동 이브닝 생성을 중지합니다.')
  } else {
    const job = schedule.scheduleJob(
      {
        hour: 16,
        minute: 0,
        dayOfWeek: new schedule.Range(1, 5),
        tz: 'Asia/Seoul'
      },
      async () => {
        if (!isHoliday(new Date())) {
          await generateEvening()
          ctx.sendMessage('자동으로 이브닝 생성을 완료하였습니다.')
        }
      }
    )
    jobs.set(jobKey, job)
    ctx.sendMessage('자동 이브닝 생성을 시작합니다.')
  }
})

bot.command('auto_youth_housing_opening', async (ctx) => {
  const userId = ctx.message.from.id
  const jobKey = userId * 3

  if (jobs.has(jobKey)) {
    const job = jobs.get(jobKey)
    job.cancel()
    jobs.delete(jobKey)
    ctx.sendMessage('자동 청약공고 조회를 중지합니다.')
  } else {
    const job = schedule.scheduleJob(
      {
        hour: 5,
        minute: 0,
        tz: 'Asia/Seoul'
      },
      async () => {
        const { message } = await checkNewYouthHousing()
        ctx.sendMessage(message)
      }
    )
    jobs.set(jobKey, job)
    ctx.sendMessage('자동 청약공고 조회를 시작합니다.')
  }
})

bot.command('health_check', async (ctx) => {
  ctx.reply('health_check')
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
