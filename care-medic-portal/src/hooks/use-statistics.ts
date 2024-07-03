import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getTotalConsultationTime,
  getCompletedConsultationsById,
  getPaySlipById,
  getWallet,
} from '@routes'
import { getAuthenticatedUser } from '@utils/auth'
import { ITotalConsultationTime } from '@types'

export const useStatistics = () => {
  const loggedInUser = getAuthenticatedUser()

  const [individualConsultationTime, setIndividualConsultationTime] =
    useState<ITotalConsultationTime>() //big nono to set type to any
  const { data: paySlip, isLoading: loadingPaySlip } = useQuery(
    ['getPaySlipById', loggedInUser.userId],
    () => getPaySlipById(parseInt(loggedInUser.userId)),
  )

  const {
    data: totalConsultationTime,
    isLoading: loadingTotalConsultationTime,
  } = useQuery(['getTotalConsultationTime'], getTotalConsultationTime)

  const {
    data: completedConsultations,
    isLoading: loadingCompletedConsultations,
  } = useQuery(['getCompletedConsultationsById', loggedInUser.userId], () =>
    getCompletedConsultationsById(parseInt(loggedInUser.userId)),
  )

  const { data: wallet, isLoading: loadingWallet } = useQuery(
    ['getWallet'],
    () => getWallet(loggedInUser.headers),
  )

  useEffect(() => {
    if (totalConsultationTime) {
      const userConsultationTime = totalConsultationTime.find(
        (item) => item.userId === Number(loggedInUser.userId),
      )
      setIndividualConsultationTime(userConsultationTime)
    }
  }, [
    totalConsultationTime,
    setIndividualConsultationTime,
    loggedInUser.userId,
  ])

  return {
    paySlip,
    individualConsultationTime,
    completedConsultations,
    wallet,
    loadingWallet,
  }
}
