import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type PreferredSharesOutput = Prisma.PreferredSharesGroupByOutputType

export type CustomExceptionSharesOutput =
  Prisma.CustomExceptionSharesGroupByOutputType

export type ConditionOutput = Prisma.SearchConditionGroupByOutputType

export type YouthHousingOutput = Prisma.YouthHousingGroupByOutputType

export const readAll = async <T>(table: Prisma.ModelName): Promise<T> => {
  return await prisma[table].findMany()
}

export const findAll = async <T>(
  table: Prisma.ModelName,
  where: object
): Promise<T> => {
  return await prisma[table].findMany({
    where
  })
}

export const findFirst = async <T>(
  table: Prisma.ModelName,
  where: object
): Promise<T> => {
  return await prisma[table].findFirst({
    where
  })
}

export const findOne = async <T>(
  table: Prisma.ModelName,
  where: object
): Promise<T> => {
  return await prisma[table].findFirst({
    where
  })
}

export const addData = async (table: Prisma.ModelName, data: any) => {
  await prisma[table].create({
    data
  })
}

export const updateData = async (
  table: Prisma.ModelName,
  where: object,
  data: object
) => {
  await prisma[table].update({
    where,
    data
  })
}

export const deleteData = async (table: Prisma.ModelName, where: object) => {
  const { id } = await prisma[table].findFirst({
    where
  })

  if (!id) return undefined

  await prisma[table].delete({
    where: {
      id
    }
  })
}

export const countData = async (table: Prisma.ModelName, where: object) => {
  return await prisma[table].count({
    where
  })
}
