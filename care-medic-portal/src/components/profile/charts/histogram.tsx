import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useStatistics } from '@hooks/use-statistics'
import { Paper, Text, useMantineTheme } from '@mantine/core'
import moment from 'moment'
import { useCallback, useMemo } from 'react'
import { MetricType } from '../metrics'

const HistoGram = ({ selectedMetric }: { selectedMetric: MetricType }) => {
  const { completedConsultations } = useStatistics()
  const { colors } = useMantineTheme()
  const months = moment.months()

  const formatMetricData = useCallback(() => {
    return months.map((monthName, index) => {
      const filteredConsultations = completedConsultations?.filter(
        (obj) => new Date(obj.timeFinished).getMonth() === index,
      )

      const Consultations = filteredConsultations?.length
      const Money = filteredConsultations?.reduce((acc, curr) => {
        if (new Date(curr.timeFinished).getMonth() === index) {
          return acc + Number(curr.amountPaid)
        }
        return acc
      }, 0)

      return {
        name: monthName,
        Consultations,
        Money,
      }
    })
  }, [months, completedConsultations])

  const data = useMemo(() => {
    return formatMetricData()
  }, [formatMetricData])

  return completedConsultations?.length > 0 ? (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <XAxis dataKey="name" />
        <YAxis accentHeight={20} />

        {selectedMetric === MetricType.All ? (
          <>
            <Bar fill={colors.teal[4]} dataKey="Consultations" />
            <Bar fill={colors.blue[5]} dataKey="Money" />{' '}
          </>
        ) : selectedMetric === MetricType.Consultation ? (
          <Bar fill={colors.teal[4]} dataKey="Consultations" />
        ) : selectedMetric === MetricType.Money ? (
          <Bar fill={colors.blue[5]} dataKey="Money" />
        ) : (
          <></>
        )}
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <Paper p={16}>
      <Text align={'center'}>Data cannot be found</Text>
    </Paper>
  )
}

export default HistoGram
