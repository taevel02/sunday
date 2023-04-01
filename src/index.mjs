import Koa from 'koa'
import cors from '@koa/cors'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'

import router from './router.mjs'

const PORT = 8000

new Koa()
  .use(parser())
  .use(logger())
  .use(cors())
  .use(router.routes())
  .use(async (ctx, next) => {
    if (!ctx.query.text) return next()
  })
  .listen(PORT, () => console.log('Server listening on port ' + PORT))
