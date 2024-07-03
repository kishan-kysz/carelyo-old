import { Paper, SimpleGrid, Text } from '@mantine/core'
import { createStyles } from '@mantine/core'
const VitalsAccordionPanel = ({ item, data }: { item; data: string }) => {
  const { classes } = useStyles()

  switch (data) {
    case 'bloodGlucose':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={'16'}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Blood sugar Per liter:</Text>
            <Text>{item.bloodGlucoseMmolPerL}L</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Meal time</Text>
            <Text>{item.mealTime.toString().slice(0, 10)}</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'bloodOxygen':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Blood oxygen percentage</Text>
            <Text>{item.bloodOxygenPercentage}%</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'bloodPressure':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Systolic blood pressure</Text>
            <Text>{item.systolicMmHg}%</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Diastolic blood pressure</Text>
            <Text>{item.diastolicMmHg}%</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Posture</Text>
            <Text>{item.posture}%</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'bodyTemperature':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Body temperature</Text>
            <Text>{item.bodyTemperatureCelsius}&#8451;</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'heartRate':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Heart rate</Text>
            <Text>{item.heartRateBpm}BPM</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'menstruation':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Flow</Text>
            <Text>{item.flow}</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Cycle started</Text>
            <Text>{item.startOfCycle ? 'YES' : 'NO'}</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Start date of cycle</Text>
            <Text>{item.startOfCycleDate.toString().slice(0, 10)}</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">End date of cycle</Text>
            <Text>{item.endOfCycleDate.toString().slice(0, 10)}</Text>
          </SimpleGrid>
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Contraceptives</Text>
            <Text>{item.contraceptive}</Text>
          </SimpleGrid>
        </Paper>
      )
    case 'respiratoryRate':
      return (
        <Paper
          sx={(theme) => ({
            '& > :nth-of-type(2n + 1)': {
              backgroundColor: '#e9ecef',
            },
          })}
          my={16}
        >
          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Created at</Text>
            <Text>{item.date.toString().slice(0, 10)}</Text>
          </SimpleGrid>

          <SimpleGrid className={classes.gridBox} cols={2}>
            <Text color="gray">Respiratory rate</Text>
            <Text>{item.breathsPerMinute}BPM</Text>
          </SimpleGrid>
        </Paper>
      )
    default:
      return <Text color="gray">No vital data found</Text>
  }
}

const useStyles = createStyles((theme) => ({
  gridBox: {
    padding: '0.625rem',
  },
}))

export default VitalsAccordionPanel
