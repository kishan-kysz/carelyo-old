/* eslint-disable import/no-anonymous-default-export */
import { prisma } from '../../../prisma/db'
import { cd10 } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

interface NextApiWithBodyRequest extends NextApiRequest {
  query: {
    take?: string
    skip?: string
    search: string
  }
  body: {
    take: number
    skip: number
    search: string
  }
}

export interface MapCd10ToSelect {
  value: string
  label: string
  description: string
  meta: Required<Omit<cd10, 'id' | 'icd103_code' | 'icd103_code_description'>>
}

async function handler(req: NextApiWithBodyRequest, res: NextApiResponse) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Method not allowed' })

  const { search, take, skip } = req.query
  const searchResults = await prisma.cd10.findMany({
    where: {
      OR: [
        { icd10_code: { startsWith: search, mode: 'insensitive' } },
        { icd103_code_description: { contains: search, mode: 'insensitive' } },
        { icd103_code: { startsWith: search, mode: 'insensitive' } },
        { who_full_description: { contains: search, mode: 'insensitive' } },
        { group_description: { contains: search, mode: 'insensitive' } },
      ],
    },
    take: parseInt(take) | 20,
    skip: parseInt(skip) | 0,
  })
  res.status(200).json(searchResults)
}

export default handler
