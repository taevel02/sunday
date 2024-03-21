import { clientSoco } from '../utils/axios'

export interface YouthHousingPost {
  boardId: number // 공고ID
  nttSj: string // 공고명
  optn1: string // 공고게시일
  optn2: string // 1: 공공 / 2: 민간
  optn3: string // 담담부서/사업자
  optn4: string // 청약신청일
}

export interface YouthHousingPostDetail extends YouthHousingPost {
  url: string
}

interface YouthHousingResponse {
  pagingInfo: {
    pageIndex: number
    totRow: number
    totPage: number
  }
  resultList: YouthHousingPost[]
}

const fetchFromSoco = async <T>(url: string, params: object): Promise<T> => {
  const response = await clientSoco.post<T>(url, params)

  if (response.status !== 200)
    throw new Error(response.statusText || 'Soco API Error')

  return response.data
}

export const readAllYouthHousingOpening = async (
  pageIndex: number = 1
): Promise<YouthHousingPostDetail[]> => {
  try {
    const data = await fetchFromSoco<YouthHousingResponse>(
      '/bbsListJson.json',
      {
        bbsId: 'BMSR00015',
        pageIndex
      }
    )

    const posts = data.resultList.map((post) => {
      return {
        boardId: post.boardId,
        nttSj: post.nttSj,
        optn1: post.optn1,
        optn2: post.optn2,
        optn3: post.optn3,
        optn4: post.optn4,
        url: `https://soco.seoul.go.kr/youth/bbs/BMSR00015/view.do?boardId=${post.boardId}&menuNo=400008`
      }
    })

    return posts
  } catch (error) {
    console.error(`[${new Date()}] ${error}`)
    return []
  }
}
