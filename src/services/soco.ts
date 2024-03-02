import { YouthHousingPostDetail, readAllYouthHousingOpening } from '../api/soco'

import * as prisma from '../utils/prisma'

export const checkNewYouthHousing = async (): Promise<{ message: string }> => {
  const data = await readAllYouthHousingOpening()
  const oldPosts = await prisma.readAll<YouthHousingPostDetail[]>(
    'YouthHousing'
  )

  if (oldPosts.length < 1) {
    await prisma.addData('YouthHousing', data[0])
    return {
      message: `${data[0].nttSj}\n공고일: ${data[0].optn1}\n청약신청일: ${data[0].optn4}\n${data[0].url}`
    }
  }

  const newPosts = data.filter((post) =>
    oldPosts.some((oldPost) => oldPost.optn1 < post.optn1)
  )

  if (newPosts.length > 0) {
    for (const post of newPosts) {
      await prisma.addData('YouthHousing', post)
    }

    return {
      message: newPosts
        .map(
          (post) =>
            `${post.nttSj}\n공고일: ${post.optn1}\n청약신청일: ${post.optn4}\n${post.url}`
        )
        .join('\n\n')
    }
  }

  return { message: '새로운 청약공고가 없습니다.' }
}
