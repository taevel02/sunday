import chalk from 'chalk'

export const logger = (...rest: [string, ...any[]]) =>
  console.log(chalk.magentaBright(rest[0], ...rest.slice(1)))

export const errorMessages = (...rest: [string, ...any[]]) =>
  console.log(chalk.redBright(rest[0], ...rest.slice(1)))
